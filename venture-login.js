import { auth, db } from './firebase.js';
import { ensureMembership, staffRoles } from './account-profile.js';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc, serverTimestamp, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const portals = {
  academy: { name:'KTS Academy', mark:'A+', audience:'JEE & NEET students', home:'index.html', destination:'index.html' },
  education: { name:'KTS Education Center', mark:'</>', audience:'career-course learners', home:'kts education center.html', destination:'kts education center.html' },
  scorehigh: { name:'Score High', mark:'SH', audience:'banking aspirants', home:'Score High.html', destination:'Testseries.html' },
  it: { name:'KTS IT Solutions', mark:'IT', audience:'technology candidates', home:'kts_it_home.html', destination:'it-candidate-profile.html' },
  marketing: { name:'KTS Digital Marketing', mark:'DM', audience:'marketing candidates and clients', home:'kts group.html#ventures', destination:'marketing-portal.html' }
};

const venture = document.body.dataset.venture;
const portal = portals[venture];
if (!portal) throw new Error('Unknown KTS venture portal.');
const staffDestinationFor = profile => venture === 'education'
  && ['enterprise_owner', 'operations_manager'].includes(profile?.role)
  ? 'kts-education-crm.html'
  : venture === 'it'
    ? 'kts-it-crm.html'
    : 'kts-enterprise-operations.html';
const faviconByVenture={academy:'favicon-academy.svg',education:'favicon-education.svg',scorehigh:'favicon-scorehigh.svg',it:'favicon-it.svg',marketing:'favicon-marketing.svg'};
const favicon=document.createElement('link');favicon.rel='icon';favicon.type='image/svg+xml';favicon.href=faviconByVenture[venture];document.head.appendChild(favicon);

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

const verifyMembership=user=>ensureMembership(user,venture);
let submitting=false;
const destinationFor=profile=>staffRoles.has(profile?.role)?staffDestinationFor(profile):safeRedirect;
const errorText=error=>error.code==='venture/inactive'?'This account is inactive. Contact KTS support.':error.code==='venture/wrong-portal'?`This account is registered with another KTS venture. Open that venture’s login portal.`:({'auth/invalid-credential':'Incorrect email or password.','auth/email-already-in-use':'An account already exists for this email. Sign in to continue or finish profile setup.','auth/weak-password':'Choose a password with at least 6 characters.','auth/invalid-email':'Enter a valid email address.','auth/too-many-requests':'Too many attempts. Please try again later.'}[error.code]||'Unable to finish setting up your profile. If you just registered, sign in with the same email and password to retry. Please contact KTS if this continues.');

document.querySelector('#signIn').addEventListener('submit',async event=>{event.preventDefault();if(submitting)return;const button=event.submitter,email=document.querySelector('#loginEmail').value.trim(),password=document.querySelector('#loginPassword').value;if(!email||!password){show('Enter your email and password.','error');return;}submitting=true;setLoading(button,true);try{const credential=await signInWithEmailAndPassword(auth,email,password),profile=await verifyMembership(credential.user);show(staffRoles.has(profile?.role)?'Signed in. Opening your staff dashboard…':'Signed in. Opening your portal…','success');location.href=destinationFor(profile);}catch(error){show(errorText(error),'error');setLoading(button,false);}finally{submitting=false;}});
document.querySelector('#signUp').addEventListener('submit',async event=>{event.preventDefault();if(submitting)return;const button=event.submitter,name=document.querySelector('#signupName').value.trim(),email=document.querySelector('#signupEmail').value.trim(),password=document.querySelector('#signupPassword').value;if(name.length<2||name.length>100||!email||password.length<6){show('Complete all fields; passwords need at least 6 characters.','error');return;}submitting=true;setLoading(button,true);try{const credential=await createUserWithEmailAndPassword(auth,email,password);await setDoc(doc(db,'users',credential.user.uid),{username:name,email,venture,role:venture==='it'?'candidate':'student',batch:portal.name,createdAt:serverTimestamp(),profileCompleted:true});show('Account created. Opening your portal…','success');location.href=safeRedirect;}catch(error){show(errorText(error),'error');setLoading(button,false);}finally{submitting=false;}});
document.querySelector('#resetPassword').addEventListener('click',async()=>{const email=document.querySelector('#loginEmail').value.trim();if(!email){show('Enter your email address first.','error');return;}try{await sendPasswordResetEmail(auth,email);show('Password-reset link sent. Check your inbox.','success');}catch(error){show(errorText(error),'error');}});
onAuthStateChanged(auth,async user=>{if(!user||submitting||message.textContent)return;try{const profile=await verifyMembership(user);location.href=destinationFor(profile);}catch(error){show(errorText(error),'error');}});
