import { authenticated } from './setFirestoreAndAuth';

// function deleteAccount
export const deleteAccount = () => {
  if (authenticated.currentUser) {
    authenticated.currentUser.delete().catch(function (error) {
      if (error.code == 'auth/requires-recent-login') {
        authenticated.signOut().then(function () {
          setTimeout(function () {
            alert('Please sign in again to delete your account.');
          }, 1);
        });
      }
    });
  }
};