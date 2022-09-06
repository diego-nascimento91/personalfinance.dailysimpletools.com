import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { authenticated } from './firebaseAuth';

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