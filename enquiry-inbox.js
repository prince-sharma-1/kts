import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { enquiryVentures } from './enquiry-model.js';

const requests = document.querySelector('#requests'), status = document.querySelector('#inboxStatus'), filter = document.querySelector('#statusFilter');
let user, subscriptions = [], groups = {}, session = 0;
const element = (tag, text, className) => { const node = document.createElement(tag); node.textContent = text; if (className) node.className = className; return node; };
function clear() { subscriptions.forEach(stop => stop()); subscriptions = []; groups = {}; requests.replaceChildren(); }
function render() {
  requests.replaceChildren();
  const records = Object.values(groups).flat().filter(record => filter.value === 'all' || record.status === filter.value)
    .sort((a, b) => (b.createdAt?.toMillis?.() || b.timestamp?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || a.timestamp?.toMillis?.() || 0));
  if (!records.length) { requests.append(element('p', 'No requests match this view.', 'empty')); return; }
  for (const record of records) {
    const card = element('article', '', 'request');
    card.append(element('h2', record.name || 'Enquiry'));
    const date = (record.createdAt || record.timestamp)?.toDate?.();
    card.append(element('p', `${record.venture || 'academy'} · ${record.type || 'counselling'} · ${record.status} · ${date ? date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Date unavailable'}`, 'meta'));
    card.append(element('p', [record.phone, record.email].filter(Boolean).join(' · ')));
    card.append(element('p', [record.interest || record.goal, record.studentClass ? `Class: ${record.studentClass}` : '', record.message].filter(Boolean).join('\n'), 'details'));
    card.append(element('p', `Reference: ${record.id} · ${record.source || 'Academy counselling'}`, 'meta'));
    const form = element('form', '', 'followup');
    const unique = `${record.collection}-${record.id}`;
    const label = element('label', 'Follow-up status'); label.htmlFor = `status-${unique}`;
    const select = document.createElement('select'); select.id = label.htmlFor;
    for (const value of ['new', 'contacted', 'scheduled', 'closed']) { const option = element('option', value); option.value = value; select.append(option); }
    select.value = record.status;
    const notesLabel = element('label', 'Staff notes'); notesLabel.htmlFor = `notes-${unique}`;
    const notes = document.createElement('textarea'); notes.id = notesLabel.htmlFor; notes.maxLength = 2000; notes.value = record.notes || '';
    const button = element('button', 'Save follow-up'); button.type = 'submit';
    const saved = element('p', '', 'save-status'); saved.setAttribute('role', 'status');
    form.append(label, select, notesLabel, notes, button, saved);
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (!user || button.disabled) return;
      button.disabled = true; saved.textContent = 'Saving…';
      try { await updateDoc(doc(db, record.collection, record.id), { status: select.value, notes: notes.value.trim(), updatedAt: serverTimestamp(), updatedBy: user.uid }); saved.textContent = 'Follow-up saved.'; }
      catch { saved.textContent = 'Could not save. Check your connection and staff access, then retry.'; }
      finally { button.disabled = false; }
    });
    card.append(form); requests.append(card);
  }
}
filter.addEventListener('change', render);
document.querySelector('#logout').onclick = async () => { clear(); await signOut(auth); };
onAuthStateChanged(auth, async current => {
  const version = ++session; clear(); user = current;
  document.querySelector('#identity').textContent = '';
  document.querySelector('#login').hidden = Boolean(current);
  if (!current) { status.textContent = 'Sign in to view the staff enquiry inbox.'; return; }
  try {
    const profile = await getDoc(doc(db, 'users', current.uid));
    if (version !== session) return;
    const allowed = profile.exists() ? enquiryVentures(profile.data()) : [];
    if (!allowed.length) { status.textContent = 'This account does not have enquiry-management access. Contact your KTS administrator.'; return; }
    document.querySelector('#identity').textContent = `${current.email} · ${allowed.join(', ')}`;
    status.textContent = 'Loading enquiries…';
    const sources = [['enquiryRequests', query(collection(db, 'enquiryRequests'), where('venture', 'in', allowed))]];
    if (allowed.includes('academy')) sources.push(['counseling_requests', collection(db, 'counseling_requests')]);
    const loaded = new Set(), failed = new Set();
    for (const [name, target] of sources) subscriptions.push(onSnapshot(target, snapshot => {
      if (version !== session) return;
      groups[name] = snapshot.docs.map(item => ({ ...item.data(), id: item.id, collection: name }));
      loaded.add(name); failed.delete(name);
      status.textContent = failed.size ? 'Some enquiries could not load. Refresh to retry.' : loaded.size === sources.length ? 'Enquiries are up to date.' : 'Loading enquiries…'; render();
    }, () => { if (version !== session) return; groups[name] = []; failed.add(name); status.textContent = 'Some enquiries could not load. Check your connection, staff permissions and deployed rules, then refresh.'; render(); }));
  } catch { if (version === session) status.textContent = 'Could not verify staff access. Please refresh and try again.'; }
});
