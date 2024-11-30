// firebaseConfig.js (for React Native)
import { FirebaseApp, initializeApp } from '@react-native-firebase/app';  // Using the correct import for React Native
import auth from '@react-native-firebase/auth';  // Using the React Native Firebase auth
import { getFirestore } from '@react-native-firebase/firestore'; // If you're using Firestore, else you can omit this

const firebaseConfig = {
  apiKey: "AIzaSyB2hyDsymQDwTkpXJlj6donaMoYU73xoL0",
  authDomain: "smartpantryapp-a524e.firebaseapp.com",
  projectId: "smartpantryapp-a524e",
  storageBucket: "smartpantryapp-a524e.firebasestorage.app",
  messagingSenderId: "563212127735",
  appId: "1:563212127735:web:906554d4453f5be019f2f2",
  measurementId: "G-DNGEQQ9BQS"
};

// Initialize Firebase for React Native
const app = initializeApp(firebaseConfig);

// Get Firebase Auth and Firestore services
export {auth};
export const firestore = getFirestore(app); // If needed for Firestore
