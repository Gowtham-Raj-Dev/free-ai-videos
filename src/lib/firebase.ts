// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgYb5vPz_feK-aXfIemd1L6dA4dxnd3-8",
  authDomain: "ai-videos-e6e03.firebaseapp.com",
  projectId: "ai-videos-e6e03",
  storageBucket: "ai-videos-e6e03.firebasestorage.app",
  messagingSenderId: "37879856930",
  appId: "1:37879856930:web:a58e191d448461f60eaf7b",
  measurementId: "G-34WCQDEM00"
};

// Initialize Firebase (safely checking if it's already initialized)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
