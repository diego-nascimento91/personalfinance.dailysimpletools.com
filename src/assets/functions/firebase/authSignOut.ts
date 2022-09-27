import { authenticated } from './setFirestoreAndAuth';

// function signout
export const signOutofAccount = () => {
  authenticated.signOut();
};