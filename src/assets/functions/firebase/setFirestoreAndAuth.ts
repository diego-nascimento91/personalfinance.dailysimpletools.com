import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configure Firebase.
const firebaseConfig = {
  apiKey: 'AIzaSyAIbU-kQK5xZSfvWCX7UlE6Z-s7h4JZkxY',
  authDomain: 'pftdailysimpletools.firebaseapp.com',
  projectId: 'pftdailysimpletools',
  storageBucket: 'pftdailysimpletools.appspot.com',
  messagingSenderId: '69296374479',
  appId: '1:69296374479:web:808884a07d6e27d386edba',
  measurementId: 'G-50VB56CNSM'
};

export const app = initializeApp(firebaseConfig);
export const authenticated = getAuth(app);
export const db = getFirestore(app);


