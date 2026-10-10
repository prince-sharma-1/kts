import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const approvedRoles=new Set(['enterprise_owner','operations_manager','business_development','developer','specialist']);
const loginUrl=`employee-login.html?redirect=${encodeURIComponent('kts-it-crm.html')}`;
document.querySelector('#crmLogout').addEventListener('click',async()=>{await signOut(auth);location.replace(loginUrl)});

onAuthStateChanged(auth,async user=>{
  if(!user){location.replace(loginUrl);return}
  try{
    const snapshot=await getDoc(doc(db,'users',user.uid));
    const profile=snapshot.exists()?snapshot.data():{};
    const ventures=Array.isArray(profile.managedVentures)?profile.managedVentures:[];
    const allowed=profile.active!==false&&approvedRoles.has(profile.role)&&(profile.venture==='it'||ventures.includes('it'));
    if(!allowed){await signOut(auth);location.replace(`${loginUrl}&error=it-access`);return}
    const name=profile.username||user.email||'KTS Staff';
    document.querySelector('#staffName').textContent=name;
    document.querySelector('#staffInitials').textContent=name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
    document.querySelector('#staffRole').textContent=profile.role.split('_').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
    window.ktsItCrmSession={user,profile};
    window.dispatchEvent(new CustomEvent('kts-it-crm-authorized',{detail:{user,profile}}));
    document.documentElement.classList.remove('crm-auth-pending');
  }catch(error){console.error('IT CRM access check failed:',error);await signOut(auth);location.replace(loginUrl)}
});
