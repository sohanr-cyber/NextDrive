// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSXCnFr7Y9on7RP1WFAiYWN_KLr2TW1UQ",
  authDomain: "nextjs-drive.firebaseapp.com",
  projectId: "nextjs-drive",
  storageBucket: "nextjs-drive.appspot.com",
  messagingSenderId: "325970868263",
  appId: "1:325970868263:web:83af5a56b9605e41fc3602",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
