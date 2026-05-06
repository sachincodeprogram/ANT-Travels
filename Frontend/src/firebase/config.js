import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 🔥 तुम्हारा Firebase config (already correct)
const firebaseConfig = {
  apiKey: "AIzaSyDC-_Lj2oSAZaAAWU2TTuhhQaC6bJ-fGBg",
  authDomain: "ant-travels.firebaseapp.com",
  projectId: "ant-travels",
  storageBucket: "ant-travels.firebasestorage.app",
  messagingSenderId: "725219085138",
  appId: "1:725219085138:web:7e41415fd0cc9ddffe088b",
  measurementId: "G-Y27XQWVP4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 IMPORTANT (login के लिए)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();