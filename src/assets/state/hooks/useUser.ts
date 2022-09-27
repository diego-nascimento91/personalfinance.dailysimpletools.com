import { authenticated } from 'assets/functions/firebase/setFirestoreAndAuth';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useUser = () => {
  return useAuthState(authenticated);
};