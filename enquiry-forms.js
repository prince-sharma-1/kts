import { db } from './firebase.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { validateEnquiry, enrollmentSources } from './enquiry-model.js';

const source = decodeURIComponent(location.pathname.split('/').pop());
const configs = {
  'book_a_demo.html': { selector: '#demoForm', venture: 'academy', type: 'demo' },
  'book_a_demo_neet.html': { selector: '#demoForm', venture: 'academy', type: 'demo' },
  'register.html': { selector: '#enrollForm', venture: 'academy', type: 'enrollment' },
  'kts group.html': { selector: '#path-form', venture: 'enterprise', type: 'general' },
  'kts_talent_solution.html': { selector: '#talentForm', venture: 'it', type: 'hiring' },
  'kts-digital-solution.html': { selector: '#solution-form', venture: 'digital', type: 'project' }
};
const config = configs[source] || (enrollmentSources[source] ? { selector: '#enrollmentForm', venture: 'academy', type: 'enrollment', course: enrollmentSources[source] } : null);
const form = config && document.querySelector(config.selector);
if (form) {
  const button = form.querySelector('button[type="submit"]');
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.style.cssText = 'margin:14px 0;line-height:1.6;overflow-wrap:anywhere';
  const consentLabel = document.createElement('label');
  consentLabel.style.cssText = 'display:flex;gap:9px;align-items:flex-start;margin:16px 0;font-size:13px';
  const consent = document.createElement('input');
  consent.type = 'checkbox'; consent.required = true; consent.name = 'contactConsent';
  consent.style.cssText = 'width:auto;min-width:16px;margin:3px 0';
  consentLabel.append(consent, document.createTextNode('I agree that KTS may contact me about this request.'));
  button.before(consentLabel);
  form.append(status);
  let saving = false;
  const value = key => String(form.elements.namedItem(key)?.value || '').trim();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (saving || !form.reportValidity()) return;
    let input = { name: value('name'), phone: value('phone'), email: value('email'), message: value('message'), interest: value('interest'), ...config, source, consent: consent.checked };
    if (config.type === 'demo') input = { ...input, interest: `${value('goal').toUpperCase()} demo — ${value('slot')}` };
    if (config.type === 'enrollment') {
      input.interest = config.course || value('course');
      if (config.course) input.message = `Current class: ${value('studentClass')}\nPayment preference: ${value('plan')}. Please confirm fees and availability.`;
    }
    if (config.type === 'hiring') input.interest = `${value('company')}: ${value('role')}`;
    if (config.type === 'project') input = { ...input, interest: value('solution'), message: `Business: ${value('business')}\nGoal: ${value('goal')}` };
    try { input = validateEnquiry(input); }
    catch (error) { status.textContent = error.message; return; }
    saving = true;
    button.disabled = true;
    const label = button.textContent;
    button.textContent = 'Sending request…';
    status.textContent = 'Saving your request…';
    try {
      const saved = await addDoc(collection(db, 'enquiryRequests'), { ...input, createdAt: serverTimestamp() });
      status.textContent = `Request received. Reference: ${saved.id}. KTS will contact you to confirm the next steps${config.type === 'demo' ? ' and demo availability' : ''}.`;
      form.reset();
    } catch (error) {
      console.error('Enquiry submission failed:', error.code);
      status.textContent = 'Your request could not be confirmed. Your details are still here. Please retry or call +91 79839 10795.';
    } finally {
      saving = false; button.disabled = false; button.textContent = label;
    }
  });
}
