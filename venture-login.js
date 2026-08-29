import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const portals = {
  academy: { name:'KTS Academy', mark:'A+', audience:'JEE & NEET students', home:'index.html', destination:'index.html' },
  education: { name:'KTS Education Center', mark:'</>', audience:'career-course learners', home:'kts education center.html', destination:'kts education center.html' },
  scorehigh: { name:'Score High', mark:'SH', audience:'banking aspirants', home:'Score High.html', destination:'Testseries.html' },
  it: { name:'KTS IT Solutions', mark:'IT', audience:'technology candidates', home:'kts_it_home.html', destination:'kts_it_home.html' },
  marketing: { name:'KTS Digital Marketing', mark:'DM', audience:'marketing candidates and clients', home:'kts group.html#ventures', destination:'marketing-portal.html' }
};

const venture = document.body.dataset.venture;
const portal = portals[venture];
if (!portal) throw new Error('Unknown KTS venture portal.');

const params = new URLSearchParams(location.search);
const safeRedirect = (() => {
  const requested = params.get('redirect');
  if (!requested) return portal.destination;
  try { const target=new URL(requested,location.href); return target.origin===location.origin ? `${target.pathname}${target.search}${target.hash}` : portal.destination; }
  catch { return portal.destination; }
})();

document.documentElement.style.setProperty('--portal', document.body.dataset.color || '#1769e0');
document.querySelectorAll('[data-portal-name]').forEach(el=>el.textContent=portal.name);
document.querySelectorAll('[data-portal-mark]').forEach(el=>el.textContent=portal.mark);
document.querySelectorAll('[data-home]').forEach(el=>el.href=portal.home);
document.querySelector('[data-audience]').textContent=`This portal is exclusively for ${portal.audience}.`;

const message=document.querySelector('#message'), title=document.querySelector('#formTitle'), subtitle=document.querySelector('#formSubtitle');
const show=(text,kind='')=>{message.textContent=text;message.className=`message ${kind}`;};
const setLoading=(button,on)=>{button.disabled=on;button.textContent=on?'Please wait…':button.dataset.label;};
const selectTab=target=>{document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.target===target));document.querySelectorAll('form').forEach(f=>f.classList.toggle('active',f.id===target));title.textContent=target==='signIn'?'Welcome back':'Create your account';subtitle.textContent=target==='signIn'?`Sign in to your ${portal.name} portal.`:`Register exclusively with ${portal.name}.`;show('');};
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>selectTab(tab.dataset.target)));
document.querySelectorAll('.submit').forEach(button=>button.dataset.label=button.textContent);
if(params.get('mode')==='signup')selectTab('signUp');
if(params.get('error')==='wrong-venture')show(`This account belongs to another KTS venture. Please use its correct portal.`,'error');

const inferLegacyVenture=profile=>profile?.venture || (profile?.batch==='KTS Academy Student'?'academy':profile?.batch==='Banking Aspirant'?'scorehigh':null);
async function verifyMembership(user){const ref=doc(db,'users',user.uid),snapshot=await getDoc(ref),profile=snapshot.exists()?snapshot.data():null;const assigned=inferLegacyVenture(profile);if(assigned&&assigned!==venture){await signOut(auth);throw Object.assign(new Error('wrong-venture'),{code:'venture/wrong-portal'});}if(!assigned){await setDoc(ref,{email:user.email,venture,role:venture==='it'?'candidate':'student',createdAt:serverTimestamp(),profileCompleted:false},{merge:true});}else if(!profile.venture){await setDoc(ref,{venture},{merge:true});}}
const errorText=error=>error.code==='venture/wrong-portal'?`This account is registered with another KTS venture. Open that venture’s login portal.`:({'auth/invalid-credential':'Incorrect email or password.','auth/email-already-in-use':'An account already exists for this email.','auth/weak-password':'Choose a password with at least 6 characters.','auth/invalid-email':'Enter a valid email address.','auth/too-many-requests':'Too many attempts. Please try again later.'}[error.code]||'Unable to continue. Please try again.');

document.querySelector('#signIn').addEventListener('submit',async event=>{event.preventDefault();const button=event.submitter,email=document.querySelector('#loginEmail').value.trim(),password=document.querySelector('#loginPassword').value;if(!email||!password){show('Enter your email and password.','error');return;}setLoading(button,true);try{const credential=await signInWithEmailAndPassword(auth,email,password);await verifyMembership(credential.user);show('Signed in. Opening your portal…','success');location.href=safeRedirect;}catch(error){show(errorText(error),'error');setLoading(button,false);}});
document.querySelector('#signUp').addEventListener('submit',async event=>{event.preventDefault();const button=event.submitter,name=document.querySelector('#signupName').value.trim(),email=document.querySelector('#signupEmail').value.trim(),password=document.querySelector('#signupPassword').value;if(!name||!email||password.length<6){show('Complete all fields; passwords need at least 6 characters.','error');return;}setLoading(button,true);try{const credential=await createUserWithEmailAndPassword(auth,email,password);await setDoc(doc(db,'users',credential.user.uid),{username:name,email,venture,role:venture==='it'?'candidate':'student',batch:portal.name,createdAt:serverTimestamp(),profileCompleted:true});show('Account created. Opening your portal…','success');location.href=safeRedirect;}catch(error){show(errorText(error),'error');setLoading(button,false);}});
document.querySelector('#resetPassword').addEventListener('click',async()=>{const email=document.querySelector('#loginEmail').value.trim();if(!email){show('Enter your email address first.','error');return;}try{await sendPasswordResetEmail(auth,email);show('Password-reset link sent. Check your inbox.','success');}catch(error){show(errorText(error),'error');}});
onAuthStateChanged(auth,async user=>{if(!user||message.textContent)return;try{await verifyMembership(user);location.href=safeRedirect;}catch{show(`You are signed into a different KTS venture. Please use the correct portal.`,'error');}});
