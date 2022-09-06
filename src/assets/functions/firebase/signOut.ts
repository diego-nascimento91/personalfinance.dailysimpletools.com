import { authenticated } from './firebaseAuth';

// function signout
export const signOutofAccount = () => {
  authenticated.signOut();
};