// firebase.js
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Import the functions you need from the SDKs you need
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
// Your Firebase config (replace with your own from Firebase Console)
const firebaseConfig = {
     apiKey: "AIzaSyDbovkhsoXdtudKdY3Ixl3KIZ1NXo4KH4k",
    authDomain: "kts-academy.firebaseapp.com",
    projectId: "kts-academy",
    storageBucket: "kts-academy.firebasestorage.app",
    messagingSenderId: "474382144386",
    appId: "1:474382144386:web:4969617fec5522ad52359b",
    measurementId: "G-CRV48HGH35"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Signup function
export async function signupUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save extra user info in Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      username: username,
      email: email
    });

    alert("Signup successful!");
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Login function
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (error) {
    alert("Error: " + error.message);
  }
}
<script type="module">
  

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = 


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  
</script>   