/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const FirebaseConfig = require('./FirebaseConfig');
const functions = FirebaseConfig.functions;
const firestore = FirebaseConfig.firestore;

exports.onCreateNewUser = functions.auth.user().onCreate(async (user) => {
  firestore.collection('users').doc(user.uid).set({ email: user.email });
});

exports.onDeleteUser = functions.auth.user().onDelete(async (user) => {

  const deleteUserData = async () => {
    //get user doc
    const userRef = firestore.collection('users').doc(user.uid);

    // get user's subcollections
    const subCollections = await userRef.listCollections();

    // for each subcollection, get the docs e delete each one of them
    for (const subCollection of subCollections) {
      console.log(`Found subcollection with id: ${subCollection.id}`);
      const subCollectionRef = firestore.collection(`users/${user.uid}/${subCollection.id}`);
      const listDocsRefs = await subCollectionRef.listDocuments();
      const listDocs = await firestore.getAll(...listDocsRefs);
      for (let doc of listDocs) {
        if (doc.exists) {
          console.log(`Found document with data: ${doc.id}`);
          await subCollectionRef.doc(doc.id).delete();
        }
      }
    }
    // delete user document
    userRef.delete();
  };

  try {
    await deleteUserData();
  } catch (error) {
    console.log(error.message);
    throw error;
  }
  console.log('Subcollections and documents deleted successfully!');
});

exports.onChangeTransaction =
  functions.firestore
    .document('users/{userId}/transactions/{transactionId}')
    .onWrite((change, context) => {

      // get current document
      const newTransaction = change.after.exists ? change.after.data() : null;
      const oldTransaction = change.before.exists ? change.before.data() : null;

      // function to update the account balance
      const updateAccountBalance = (account, amount) => {
        // write code to update balance
        // **************************************************
        // const accountDoc = firestore.collection('users/{userId}/transactions').doc(transactionId);
      };

      const typeOfChange = newTransaction === null ? 'delete' : oldTransaction === null ? 'create' : 'update';
      console.log('type of change', typeOfChange);
      console.log('');

      // Transaction Deleted
      if (typeOfChange === 'delete') {
        const account = oldTransaction.account;

        // getting the value to add to the account
        const typeTransaction = oldTransaction.type;
        const amount = -(typeTransaction === 'income' ? +Math.abs(oldTransaction.amount) : -Math.abs(oldTransaction.amount));
        // the minus sign is to revert the transaction, as this is a delete operation

        updateAccountBalance(account, amount);
        console.log('doc deleted - account', account);
        console.log('doc deleted - account', amount);

      }
      // Transaction Created
      else if (typeOfChange === 'create') {
        const account = newTransaction.account;

        // getting the value to add to the account
        const typeTransaction = newTransaction.type;
        const amount = typeTransaction === 'income' ? +Math.abs(oldTransaction.amount) : -Math.abs(oldTransaction.amount);

        updateAccountBalance(account, amount);
        console.log('doc created - account', account);
        console.log('doc created - amount', amount);

      }
      // Transaction Updated
      else {
        const newAccount = newTransaction.account;
        const oldAccount = oldTransaction.account;

        // getting the value to add to the account
        const newTypeTransaction = newTransaction.type;
        const oldTypeTransaction = oldTransaction.type;
        const newAmount = newTypeTransaction === 'income' ? +Math.abs(newTransaction.amount) : -Math.abs(newTransaction.amount);
        const oldAmount = oldTypeTransaction === 'income' ? +Math.abs(oldTransaction.amount) : -Math.abs(oldTransaction.amount);

        // Account was not updated
        if (newAccount.id === oldAccount.id) {
          amount = newAmount - oldAmount;
          updateAccountBalance(newAccount, amount);
          console.log('doc updated (without changing account) - account', account);
          console.log('doc updated (without changing account) - amount', amount);

        }
        // Account was updated
        else {
          updateAccountBalance(newAccount, newAmount);
          updateAccountBalance(oldAccount, oldAmount);
          console.log('doc updated (changing account) - newAccount', newAccount);
          console.log('doc updated (changing account) - newAmount', newAmount);
          console.log('');
          console.log('doc updated (changing account) - oldAccount', oldAccount);
          console.log('doc updated (changing account) - oldAmount', oldAmount);
        }
      }
    });