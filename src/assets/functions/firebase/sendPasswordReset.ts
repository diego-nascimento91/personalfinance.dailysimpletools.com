import { sendPasswordResetEmail } from 'firebase/auth';
import { authenticated } from './firebaseAuth';

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(authenticated, email);
  } catch (err) {
    console.log(err);
  }
};