// src/firebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/firestore';


  
  const firebaseConfig = {
    apiKey: "AIzaSyB2hyDsymQDwTkpXJlj6donaMoYU73xoL0",
    authDomain: "smartpantryapp-a524e.firebaseapp.com",
    projectId: "smartpantryapp-a524e",
    storageBucket: "smartpantryapp-a524e.firebasestorage.app",
    messagingSenderId: "563212127735",
    appId: "1:563212127735:web:906554d4453f5be019f2f2",
    measurementId: "G-DNGEQQ9BQS"
  };
  
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the existing app if already initialized
}


// Export the database object for use in other parts of the app
export { firebaseConfig };
