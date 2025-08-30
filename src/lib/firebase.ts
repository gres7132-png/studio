'use client';
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
        if (!firebaseConfig.apiKey) {
            throw new Error("Firebase API Key is missing. Firebase could not be initialized.");
        }
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // Handle server-side case gracefully if needed, though most auth/db usage will be client-side.
    // For this app, we prevent initialization on the server.
}


export { app, auth, db };

    