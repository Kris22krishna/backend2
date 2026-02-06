// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth = null;
let googleProvider = null;

try {
    if (firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
        // analytics = getAnalytics(app); // Only if needed in specific components
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
    } else {
        console.warn("Firebase projectId is missing. Google Login will be disabled.");
    }
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

export { auth, googleProvider, signInWithPopup };
