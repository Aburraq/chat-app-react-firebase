// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-app-react-firebase-f7fc8.firebaseapp.com",
  projectId: "chat-app-react-firebase-f7fc8",
  storageBucket: "chat-app-react-firebase-f7fc8.appspot.com",
  messagingSenderId: "455297648639",
  appId: "1:455297648639:web:8518600e11702ec151c9ca",
  measurementId: "G-VW0D2YW73W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();