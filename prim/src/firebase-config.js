// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPPF1n0oJIRIipzoX1VMH9V02475KCHzM",
  authDomain: "makomo-esms.firebaseapp.com",
  projectId: "makomo-esms",
  storageBucket: "makomo-esms.firebasestorage.app",
  messagingSenderId: "589924527882",
  appId: "1:589924527882:web:084f4d5a292689b2b314f3",
  measurementId: "G-WX9ZDFRHJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export constant auth = getAuth(app);