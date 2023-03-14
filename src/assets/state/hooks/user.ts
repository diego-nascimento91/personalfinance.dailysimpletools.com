import { authenticated } from 'assets/functions/FirebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useUser = () => {
  return useAuthState(authenticated);
};


