import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCTMELNlhZ6Rwuqef-NnI5r3jZXAUVcM_s",
  authDomain: "social-media-clone-e713e.firebaseapp.com",
  projectId: "social-media-clone-e713e",
  storageBucket: "social-media-clone-e713e.appspot.com",
  messagingSenderId: "279434260922",
  appId: "1:279434260922:web:e8c0424ba04db242d3ad83",
  measurementId: "G-CNM35ETPWJ",
});

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
