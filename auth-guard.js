import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

document.documentElement.style.visibility = 'hidden';

const currentFile = window.location.pathname.split('/').pop() || 'index.html';
const returnTo = `${currentFile}${window.location.search}${window.location.hash}`;
const venture = document.documentElement.dataset.venture || 'academy';
const portalPages = { academy:'academy-login.html', education:'education-login.html', scorehigh:'score-high-login.html', it:'it-login.html', marketing:'marketing-login.html' };
const portalPage = portalPages[venture] || portalPages.academy;
const loginUrl = `${portalPage}?redirect=${encodeURIComponent(returnTo)}`;
const academyCourseIds = {
  'velocity_neet.html':'neet-velocity', 'momentum_neet.html':'neet-momentum', 'power_neet.html':'neet-power', 'impulse_neet.html':'neet-impulse',
  'velocity_jee.html':'jee-velocity', 'momentum_jee.html':'jee-momentum', 'power_jee.html':'jee-power', 'impulse_jee.html':'jee-impulse'
};

function attachAcademyDashboardLink() {
  const courseId = academyCourseIds[currentFile.toLowerCase()];
  if (!courseId || document.querySelector('.academy-dashboard-link')) return;
  const link = document.createElement('a');
  link.className = 'academy-dashboard-link';
  link.href = `academy-dashboard.html?course=${courseId}`;
  link.textContent = 'Open Course Dashboard →';
  link.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:9999;padding:13px 17px;border-radius:999px;background:linear-gradient(135deg,#38bdf8,#22c55e);color:#061724;text-decoration:none;font:800 13px Inter,Arial,sans-serif;box-shadow:0 14px 35px rgba(0,0,0,.3)';
  document.body.appendChild(link);
}

onAuthStateChanged(
  auth,
  async user => {
    if (!user) {
      window.location.replace(loginUrl);
      return;
    }
    try {
      const profileRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(profileRef);
      const profile = snapshot.exists() ? snapshot.data() : {};
      const assigned = profile.venture || (profile.batch === 'KTS Academy Student' ? 'academy' : profile.batch === 'Banking Aspirant' ? 'scorehigh' : null);
      if (assigned && assigned !== venture) {
        await signOut(auth);
        window.location.replace(`${portalPage}?error=wrong-venture&redirect=${encodeURIComponent(returnTo)}`);
        return;
      }
      if (!profile.venture) await setDoc(profileRef, { venture }, { merge:true });
      document.documentElement.style.visibility = '';
      if (venture === 'academy') attachAcademyDashboardLink();
    } catch {
      window.location.replace(`${portalPage}?redirect=${encodeURIComponent(returnTo)}`);
    }
  },
  () => window.location.replace(loginUrl)
);
