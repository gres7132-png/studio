
import admin from 'firebase-admin';

// This is a server-only file.

const firebaseConfig = {
  "projectId": "balenciaga-marketing-rights",
  "appId": "1:27339502819:web:f86084b6f225c001df81d6",
  "storageBucket": "balenciaga-marketing-rights.firebasestorage.app",
  "apiKey": "AIzaSyB1Vv--6RrOLhbfhAynO01CTP-T-fXNUi8",
  "authDomain": "balenciaga-marketing-rights.firebaseapp.com",
  "messagingSenderId": "27339502819"
};


if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}


export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
