
import admin from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

const firebaseConfig = {
  "projectId": "balenciaga-marketing-rights",
};

// This function ensures the app is initialized only once.
const initializeAdminApp = () => {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    try {
        return admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        // We re-throw the error to make it clear that initialization failed.
        throw new Error('Failed to initialize Firebase Admin SDK.');
    }
};

// We now export functions that get the services, ensuring initialization has occurred.
function getAdminAuth(): Auth {
    initializeAdminApp();
    return admin.auth();
}

function getAdminDb(): Firestore {
    initializeAdminApp();
    return admin.firestore();
}

export const adminAuth = getAdminAuth();
export const adminDb = getAdminDb();
