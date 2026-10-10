import { db } from './firebase.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const form=document.querySelector('#hiring-form'),status=document.querySelector('#form-status'),waPhone='917983910795';
form.addEventListener('submit',async event=>{
  event.preventDefault();event.stopImmediatePropagation();if(!form.reportValidity())return;
  const button=form.querySelector('button[type="submit"]'),data=new FormData(form);
  const lead={name:data.get('name').trim(),company:data.get('company').trim(),phone:data.get('phone').trim(),email:data.get('email').trim(),role:data.get('role').trim(),model:data.get('model'),details:data.get('details').trim(),status:'new',source:'it-homepage',venture:'it',createdAt:serverTimestamp()};
  button.disabled=true;button.textContent='Saving request…';
  try{await addDoc(collection(db,'itEmployerLeads'),lead);status.textContent='Request saved in KTS CRM. Opening WhatsApp for direct follow-up…';status.classList.add('show');const message=`Hello KTS IT Solutions, I submitted a hiring request.\n\nName: ${lead.name}\nCompany: ${lead.company}\nPhone: ${lead.phone}\nEmail: ${lead.email||'Not provided'}\nRole needed: ${lead.role}\nHiring model: ${lead.model}\nDetails: ${lead.details||'Not provided'}`;window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`,'_blank','noopener');form.reset()}catch(error){console.error('Employer lead save failed:',error);status.textContent='We could not save the request. Please call +91 79839 10795 or try again.';status.classList.add('show')}finally{button.disabled=false;button.textContent='Continue on WhatsApp →'}
},true);
