import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const approvedRoles = new Set(['enterprise_owner', 'operations_manager']);
const loginUrl = `employee-login.html?redirect=${encodeURIComponent('kts-education-crm.html')}`;

function showWorkspace(user, profile) {
  const name = profile.username || user.email || 'KTS Staff';
  const initials = name.split(/\s+/).map(part => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  document.querySelector('#staffName').textContent = name;
  document.querySelector('#staffInitials').textContent = initials || 'KS';
  document.querySelector('#staffRole').textContent = profile.role === 'enterprise_owner' ? 'Enterprise Owner' : 'Education Center Administrator';
  window.ktsEducationCrmSession = { user, profile };
  window.dispatchEvent(new CustomEvent('kts-crm-authorized', { detail: { user, profile } }));
  document.documentElement.classList.remove('crm-auth-pending');
}

document.querySelector('#crmLogout').addEventListener('click', async () => {
  await signOut(auth);
  location.replace('employee-login.html?redirect=kts-education-crm.html');
});

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace(loginUrl);
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    const profile = snapshot.exists() ? snapshot.data() : {};
    const ventures = Array.isArray(profile.managedVentures) ? profile.managedVentures : [];
    const hasEducationAccess = profile.venture === 'education' || ventures.includes('education');

    if (profile.active === false || !approvedRoles.has(profile.role) || !hasEducationAccess) {
      await signOut(auth);
      location.replace(`${loginUrl}&error=education-access`);
      return;
    }

    showWorkspace(user, profile);
  } catch (error) {
    console.error('Education CRM access check failed:', error);
    await signOut(auth);
    location.replace(loginUrl);
  }
});
