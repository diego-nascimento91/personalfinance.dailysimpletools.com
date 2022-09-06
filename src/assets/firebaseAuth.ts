import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { query, collection, where, getDocs, addDoc, getFirestore } from 'firebase/firestore';


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

// function deleteAccount
export const deleteAccount = () => {
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

// function signout
export const signOutofAccount = () => {
  authenticated.signOut();
};

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

//LogIn with email and Password
export const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(authenticated, email, password);
  } catch (err) {
    return err;
  }
};

//Create new account with email and password
export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(authenticated, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    console.error(err);
    if(err instanceof Error){
      alert(err.message);
    }
  }
};

export const sendPasswordReset = async (email: 'string') => {
  try {
    await sendPasswordResetEmail(authenticated, email);
    alert('Password reset link sent!');
  } catch (err) {
    console.error(err);
    if(err instanceof Error){
      alert(err.message);
    }
  }
};

//get signins methods from user
export const getSignInMethods = async (email: string) => {
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
