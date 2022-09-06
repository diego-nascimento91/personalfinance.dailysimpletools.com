import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { query, collection, where, getDocs, addDoc} from 'firebase/firestore';
import { authenticated, db } from './firebaseAuth';

//Auth with Google
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(authenticated, googleProvider);
    const user = res.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    if(err instanceof Error){
      alert(err.message);
    }
  }
};