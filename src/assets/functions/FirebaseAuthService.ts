import { authenticated } from './FirebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  fetchSignInMethodsForEmail, 
  GoogleAuthProvider, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword, 
  signInWithPopup  
} from 'firebase/auth';

const deleteAccount = () => {
  if (authenticated.currentUser) {
    authenticated.currentUser.delete().catch(function (error) {
      if (error.code == 'auth/requires-recent-login') {
        authenticated.signOut().then(function () {
          setTimeout(function () {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  }
};

const getSignInMethods = async (email: string) => {
  try {
    const methods = await fetchSignInMethodsForEmail(authenticated, email);
    alert('Sign In Methods Requested!');
    console.log(methods);
  } catch (err) {
    console.error(err);
    if(err instanceof Error){
      alert(err.message);
    }
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(authenticated, email, password);
  } catch (err) {
    return err;
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(authenticated, email);
  } catch (err) {
    console.log(err);
  }
};

const createNewUserWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(authenticated, email, password);
  } catch (err) {
    if(err instanceof Error){
      return err;
    }
  }
};

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(authenticated, googleProvider);
    // const user = res.user;
    // const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    // const docs = await getDocs(q);
    // if (docs.docs.length === 0) {
    //   await addDoc(collection(db, 'users'), {
    //     uid: user.uid,
    //     name: user.displayName,
    //     authProvider: 'google',
    //     email: user.email,
    //   });
    // }
  } catch (err) {
    console.error(err);
    if(err instanceof Error){
      alert(err.message);
    }
  }
};

const signOutofAccount = () => {
  authenticated.signOut();
};

const FirebaseAuthService = {
  createNewUserWithEmailAndPassword,
  deleteAccount,
  getSignInMethods,
  logInWithEmailAndPassword,
  sendPasswordReset,
  signInWithGoogle,
  signOutofAccount,
};
export default FirebaseAuthService;