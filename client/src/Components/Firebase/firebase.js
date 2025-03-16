import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA_1s6dKsJELfXIOOcJABnAsNFI8zwioag',
  authDomain: 'auth-928bc.firebaseapp.com',
  projectId: 'auth-928bc',
  storageBucket: 'auth-928bc.firebasestorage.app',
  messagingSenderId: '79219907077',
  appId: '1:79219907077:web:6408fdc4a879a88dc49a6c',
  measurementId: 'G-Z8LY5K73VW',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
