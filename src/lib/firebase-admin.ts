
import admin from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

// This function ensures the app is initialized only once.
const initializeAdminApp = () => {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    // In a real deployed environment (like Firebase App Hosting), 
    // the SDK automatically discovers the service account credentials.
    // No manual configuration is needed.
    try {
        return admin.initializeApp();
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        // We re-throw the error to make it clear that initialization failed.
        throw new Error('Failed to initialize Firebase Admin SDK. Ensure the server environment has the correct permissions.');
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
