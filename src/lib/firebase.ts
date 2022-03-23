import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: 'AIzaSyA-XM9Sgh5o3NiYtfug-WbPNhljHp91_YQ',
   authDomain: 'instagram-clone-b309e.firebaseapp.com',
   projectId: 'instagram-clone-b309e',
   storageBucket: 'instagram-clone-b309e.appspot.com',
   messagingSenderId: '321956707383',
   appId: '1:321956707383:web:5a7c2f27367364138b53b2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { app, storage, db, auth, googleProvider };
