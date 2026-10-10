import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const portalLink = document.querySelector('#educationPortalLink');

onAuthStateChanged(auth, async user => {
  if (!user || !portalLink) return;
  try {
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    if (!snapshot.exists()) return;
    const profile = snapshot.data();
    const managedVentures = Array.isArray(profile.managedVentures) ? profile.managedVentures : [];
    const isEducationManager = ['enterprise_owner', 'operations_manager'].includes(profile.role)
      && profile.active !== false
      && (profile.venture === 'education' || managedVentures.includes('education'));
    if (isEducationManager) {
      portalLink.href = 'kts-education-crm.html';
      portalLink.textContent = 'Staff dashboard';
      portalLink.setAttribute('aria-label', 'Open KTS Education Center staff dashboard');
    }
  } catch (error) {
    console.warn('Could not personalize the Education Center portal link.', error);
  }
});
