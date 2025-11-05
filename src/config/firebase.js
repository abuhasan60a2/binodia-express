import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Inline Firebase config as requested (no env files). Replace with your project values.
const firebaseConfig = {
    apiKey: "AIzaSyC56cwvncWFOllWt3dQCj20Jb4cByMI3Vw",
    authDomain: "binodia-express.firebaseapp.com",
    projectId: "binodia-express",
    storageBucket: "binodia-express.firebasestorage.app",
    messagingSenderId: "589706457901",
    appId: "1:589706457901:web:b154487ba3f3dd1b87d9a4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;


