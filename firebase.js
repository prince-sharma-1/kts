// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbovkhsoXdtudKdY3Ixl3KIZ1NXo4KH4k",
  authDomain: "kts-academy.firebaseapp.com",
  projectId: "kts-academy",
  storageBucket: "kts-academy.appspot.com",
  messagingSenderId: "474382144386",
  appId: "1:474382144386:web:4969617fec5522ad52359b",
  measurementId: "G-CRV48HGH35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Signup function
export async function signupUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, "users"), {
      uid: user.uid,
      username,
      email
    });

    alert("Signup successful!");
  } catch (error) {
    alert(error.message);
  }
}

// Login function
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (error) {
    alert(error.message);
  }
}

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function addCourse(course) {
  await addDoc(collection(db, "courses"), {
    title: course.title,
    price: course.price,
    description: course.description,
    createdAt: new Date()
  });
} 
function goBack() {
  window.history.back();
}
