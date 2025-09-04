// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// This object is used to connect to your Firebase project.
export const firebaseConfig = {
  apiKey: "AIzaSyDnFrJWS2t_05w8i3rLen8UXK6nP8eNY1g",
  authDomain: "fundflow-wzhal.firebaseapp.com",
  projectId: "fundflow-wzhal",
  storageBucket: "fundflow-wzhal.firebasestorage.app",
  messagingSenderId: "231100893920",
  appId: "1:231100893920:web:c6e5fb9a41984b4f85de85"
};

// Initialize Firebase for client-side usage
// This pattern prevents re-initializing the app on every hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
