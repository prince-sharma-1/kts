
// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// ✅ Your Firebase config (replace with your project’s values)
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9e-RohUKRKvm7m_Nh0FexDIBEJiuYq5E",
  authDomain: "kts-academy-16860.firebaseapp.com",
  databaseURL: "https://kts-academy-16860-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kts-academy-16860",
  storageBucket: "kts-academy-16860.firebasestorage.app",
  messagingSenderId: "193575636514",
  appId: "1:193575636514:web:84e00a1386f731d084447b",
  measurementId: "G-ZVMCBYYH1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔑 Generate Enrollment ID
function generateEnrollmentID() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000); 
  return `KTS${year}-${randomNum}`;
}

// 📝 Signup Function
export async function signupUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      username: username,
      role: "student",          // default role
      batch: "Unassigned",      // can be updated later
      enrollmentID: generateEnrollmentID(),
      createdAt: new Date(),
      testsAttempted: [],
      profileCompleted: false
    });

    alert("Signup successful! Account created.");
  } catch (error) {
    alert("Signup Error: " + error.message);
  }
}

// 🔑 Login Function
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful! Welcome back.");
  } catch (error) {
    alert("Login Error: " + error.message);
  }
}
