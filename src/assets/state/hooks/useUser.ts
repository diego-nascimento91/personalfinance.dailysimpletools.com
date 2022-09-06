import { authenticated } from 'assets/firebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useUser = () => {
  return useAuthState(authenticated);
};