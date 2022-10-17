const FirebaseConfig = require('./FirebaseConfig');

const functions = FirebaseConfig.functions;
const firestore = FirebaseConfig.firestore;

exports.onCreateNewUser = functions.auth.user().onCreate( async (user) => {
  firestore.collection('users').doc(user.uid).set({ email: user.email });
});

exports.onDeleteUser = functions.auth.user().onDelete((user) => {
  firestore.collection('users').doc(user.uid).delete();
});
