import { db } from './firebase.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const form = document.querySelector('#counsellingForm');
const status = document.querySelector('#formStatus');
const submit = form.querySelector('.submit-button');
const menu = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav-actions');

document.querySelector('#year').textContent = new Date().getFullYear();

menu.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(isOpen));
  menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navigation.addEventListener('click', () => {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const originalLabel = submit.innerHTML;
  submit.disabled = true;
  submit.innerHTML = '<span>Sending your request…</span>';
  status.hidden = true;
  status.className = 'form-status full-field';

  try {
    await addDoc(collection(db, 'counseling_requests'), {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      goal: form.goal.value,
      studentClass: form.studentClass.value,
      message: form.message.value.trim(),
      venture: 'academy',
      status: 'new',
      timestamp: new Date()
    });

    form.reset();
    status.textContent = 'Thank you—your counselling request has been received. A KTS Academy mentor will contact you shortly.';
    status.classList.add('success');
  } catch (error) {
    console.error('Counselling request failed:', error);
    status.textContent = 'We could not send your request right now. Please try again or call +91 79839 10795.';
    status.classList.add('error');
  } finally {
    status.hidden = false;
    submit.disabled = false;
    submit.innerHTML = originalLabel;
  }
});
