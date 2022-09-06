import { authenticated } from 'assets/functions/firebase/firebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useUser = () => {
  return useAuthState(authenticated);
};