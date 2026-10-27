import { auth, db } from './firebase.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export const staffRoles = new Set(['enterprise_owner', 'operations_manager', 'business_development', 'developer', 'specialist']);
const ventures = new Set(['academy', 'education', 'scorehigh', 'it', 'marketing']);
export const legacyVenture = profile => profile?.venture
  || (profile?.batch === 'KTS Academy Student' ? 'academy' : profile?.batch === 'Banking Aspirant' ? 'scorehigh' : null);

// Recover an Auth account whose initial profile write failed, without replacing
// an existing profile or allowing an unknown legacy account to pick its access.
export async function ensureMembership(user, venture) {
  if (!ventures.has(venture)) throw new Error('Unknown venture');
  const reference = doc(db, 'users', user.uid);
  const snapshot = await getDoc(reference);
  if (!snapshot.exists()) {
    const profile = { email: user.email, venture, role: venture === 'it' ? 'candidate' : 'student', createdAt: serverTimestamp(), profileCompleted: false };
    await setDoc(reference, profile);
    return profile;
  }
  const profile = snapshot.data();
  const assigned = legacyVenture(profile);
  const managed = Array.isArray(profile.managedVentures) ? profile.managedVentures : [];
  const permitted = assigned === venture || (staffRoles.has(profile.role) && managed.includes(venture));
  if (profile.active === false || !permitted) {
    await signOut(auth);
    throw Object.assign(new Error('Account is not assigned to this portal'), { code: profile.active === false ? 'venture/inactive' : 'venture/wrong-portal' });
  }
  if (!profile.venture) await setDoc(reference, { venture: assigned }, { merge: true });
  return { ...profile, venture: assigned };
}
