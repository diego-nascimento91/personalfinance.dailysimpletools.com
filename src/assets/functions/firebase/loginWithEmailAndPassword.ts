import { signInWithEmailAndPassword } from 'firebase/auth';
import { authenticated } from './firebaseAuth';

//LogIn with email and Password
export const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(authenticated, email, password);
  } catch (err) {
    return err;
  }
};