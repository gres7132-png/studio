
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


// Initialize Firebase Client App
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };
