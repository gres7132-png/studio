'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "balenciaga-marketing-rights",
  "appId": "1:27339502819:web:f86084b6f225c001df81d6",
  "storageBucket": "balenciaga-marketing-rights.firebasestorage.app",
  "apiKey": "AIzaSyB1Vv--6RrOLhbfhAynO01CTP-T-fXNUi8",
  "authDomain": "balenciaga-marketing-rights.firebaseapp.com",
  "messagingSenderId": "27339502819"
};

// Initialize Firebase for client-side only
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
