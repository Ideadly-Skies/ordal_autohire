// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdZ_wPLHgf2HZREJFwVNPqduRwQi5up4w",
  authDomain: "ordal-autohire-database.firebaseapp.com",
  projectId: "ordal-autohire-database",
  storageBucket: "ordal-autohire-database.firebasestorage.app",
  messagingSenderId: "185332123293",
  appId: "1:185332123293:web:570b5bb0d2711aa7d1b674",
  measurementId: "G-W99W3YK3TN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
