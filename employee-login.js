import { auth, db } from './firebase.js';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const allowedRoles = new Set(['enterprise_owner', 'operations_manager', 'business_development', 'developer', 'specialist']);
const form = document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const submitButton = document.querySelector('#submitButton');
const message = document.querySelector('#message');
let submitting = false;

function showMessage(text, kind = 'error') {
  message.textContent = text;
  message.className = `message show ${kind}`;
}

function clearMessage() {
  message.textContent = '';
  message.className = 'message';
}

function goToWorkspace() {
  const requested = new URLSearchParams(location.search).get('redirect');
  // Employee sessions may only redirect to the staff workspace on this site.
  location.replace(requested === 'kts-enterprise-operations.html' ? requested : 'kts-enterprise-operations.html');
}

async function hasStaffAccess(user) {
  const profile = await getDoc(doc(db, 'users', user.uid));
  return profile.exists() && allowedRoles.has(profile.data().role);
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  clearMessage();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    showMessage('Enter your work email and password to continue.');
    return;
  }

  submitting = true;
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = 'Signing in…';
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!(await hasStaffAccess(credential.user))) {
      await signOut(auth);
      showMessage('This account does not have employee workspace access. Ask your KTS administrator to provision your employee account and role.');
      return;
    }
    goToWorkspace();
  } catch (error) {
    console.error('Employee sign-in failed:', error);
    showMessage(error?.code === 'auth/network-request-failed'
      ? 'Could not connect. Check your internet connection and try again.'
      : 'Sign-in failed. Check your details or ask your KTS administrator for help.');
  } finally {
    submitting = false;
    submitButton.disabled = false;
    submitButton.querySelector('span').textContent = 'Sign in to workspace';
  }
});

document.querySelector('#resetPassword').addEventListener('click', async () => {
  clearMessage();
  const email = emailInput.value.trim();
  if (!email) {
    emailInput.focus();
    showMessage('Enter your work email first, then choose “Forgot password?”');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage('If an account is registered for this address, a password reset email has been sent.', 'success');
  } catch (error) {
    console.error('Password reset request failed:', error);
    showMessage(error?.code === 'auth/network-request-failed'
      ? 'Could not connect. Check your internet connection and try again.'
      : 'We could not send a reset email. Check the address or contact your KTS administrator.');
  }
});

onAuthStateChanged(auth, async currentUser => {
  if (!currentUser || submitting) return;
  try {
    if (await hasStaffAccess(currentUser)) goToWorkspace();
    else {
      await signOut(auth);
      showMessage('This account does not have employee workspace access. Ask your KTS administrator to provision your employee account and role.');
    }
  } catch (error) {
    console.error('Could not verify employee access:', error);
    await signOut(auth);
    showMessage('We could not verify your KTS staff access. Please try again or contact your administrator.');
  }
});
