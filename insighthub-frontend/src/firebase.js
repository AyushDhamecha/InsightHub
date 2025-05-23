// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCL7LJMRIRYrpGXCVHMim7AzijOQTT2GMo",
  authDomain: "insighthub-1b41c.firebaseapp.com",
  projectId: "insighthub-1b41c",
  storageBucket: "insighthub-1b41c.firebasestorage.app",
  messagingSenderId: "643041705800",
  appId: "1:643041705800:web:cce4e3534a695395a67d7d",
  measurementId: "G-3Y55REBLW2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
