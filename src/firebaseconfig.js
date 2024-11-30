import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "<Your-API-Key>",
  authDomain: "<Your-Auth-Domain>",
  projectId: "<Your-Project-ID>",
  storageBucket: "<Your-Storage-Bucket>",
  messagingSenderId: "<Your-Sender-ID>",
  appId: "<Your-App-ID>",
  measurementId: "<Your-Measurement-ID>",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
