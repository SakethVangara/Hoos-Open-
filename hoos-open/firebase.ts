// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAduQruaoSvg-7i-aT4NiuiJvvUMrGBUqs",
  authDomain: "hoos-open-95379.firebaseapp.com",
  projectId: "hoos-open-95379",
  storageBucket: "hoos-open-95379.firebasestorage.app",
  messagingSenderId: "811553857884",
  appId: "1:811553857884:web:214d0cd1f08ca2cbb4e199"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export{app, db};
