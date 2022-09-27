import { signInWithEmailAndPassword } from 'firebase/auth';
import { authenticated } from './setFirestoreAndAuth';

//LogIn with email and Password
export const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(authenticated, email, password);
  } catch (err) {
    return err;
  }
};