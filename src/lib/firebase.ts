import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBQpg8bR0UTPqZ6qRS5il5roiSfOCLKJbw",
    authDomain: "ap-project-uni.firebaseapp.com",
    projectId: "ap-project-uni",
    storageBucket: "ap-project-uni.firebasestorage.app",
    messagingSenderId: "221482361734",
    appId: "1:221482361734:web:218caa504881d2c0a90207"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
