// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD052QaAfvdf9sdLExCn3d7ijdGNROPUAc",
  authDomain: "movie-app-full-stack-1.firebaseapp.com",
  projectId: "movie-app-full-stack-1",
  storageBucket: "movie-app-full-stack-1.appspot.com",
  messagingSenderId: "732289375022",
  appId: "1:732289375022:web:de388fa799e9021c4c38bf",
  measurementId: "G-GK807470HK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);