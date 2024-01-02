// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCZZe91b5S5hBBW1GC17HMNQNEGF6QoG8",
  authDomain: "mern-real-estate-app-4c983.firebaseapp.com",
  projectId: "mern-real-estate-app-4c983",
  storageBucket: "mern-real-estate-app-4c983.appspot.com",
  messagingSenderId: "296489681420",
  appId: "1:296489681420:web:d685e664c31e84fb29e429",
  measurementId: "G-FQW9NJ5P3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };