// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For more information on how to get this, visit:
// https://firebase.google.com/docs/web/setup#available-libraries

// IMPORTANT: Replace the placeholder values below with the actual
// configuration object from your Firebase project's settings.
export const firebaseConfig = {"apiKey":"YOUR_API_KEY","authDomain":"YOUR_AUTH_DOMAIN","projectId":"YOUR_PROJECT_ID","storageBucket":"YOUR_STORAGE_BUCKET","messagingSenderId":"YOUR_MESSAGING_SENDER_ID","appId":"YOUR_APP_ID"};

// Initialize Firebase for client-side usage
// This pattern prevents re-initializing the app on every hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
