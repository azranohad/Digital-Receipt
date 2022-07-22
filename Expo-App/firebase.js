// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB7obuRB0zMOF1D8e8vJK9SrOn0AtYySs",
  authDomain: "invertible-fin-335322.firebaseapp.com",
  projectId: "invertible-fin-335322",
  storageBucket: "invertible-fin-335322.appspot.com",
  messagingSenderId: "159408969705",
  appId: "1:159408969705:web:a4a26475b8972844a01d78",
  measurementId: "G-RX6Z8F66RR"
};


if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
export {firebase, getStorage};
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const storage = getStorage(app);