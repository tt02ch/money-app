import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAPGqvQt15lRXVz6af-AiY13C-47nc0zQE",
  authDomain: "do-an-cuoi.firebaseapp.com",
  projectId: "do-an-cuoi",
  storageBucket: "do-an-cuoi.appspot.com",
  messagingSenderId: "1065328900422",
  appId: "1:1065328900422:web:61d1266b597f4a7ac64d47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Export the initialized app, db, and auth
export { app, db, auth };
