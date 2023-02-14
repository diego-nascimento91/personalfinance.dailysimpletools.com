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

exports.onChangeTransaction = functions.firestore.document('users/{userId}/transactions/{transactionId}').onWrite(async (change, context) => {

  // get current document
  const newTransaction = change.after.exists ? change.after.data() : null;
  const oldTransaction = change.before.exists ? change.before.data() : null;

  // function to update the account balance
  const updateAccountBalance = async (account, amount) => {
    const accountDocRef = firestore.doc(`users/${context.params.userId}/accounts/${account.id}`);
    const accountDoc = await accountDocRef.get();

    if (accountDoc.exists) {
      const amountDoc = accountDoc.data().balance;
      accountDocRef.update({ balance: amountDoc + amount });
    } else {
      console.log('** doc not found');
      return null;
    }
  };

  const typeOfChange = newTransaction === null ? 'delete' : oldTransaction === null ? 'create' : 'update';

  // Transaction Deleted
  if (typeOfChange === 'delete') {
    await updateAccountBalance(oldTransaction.account, -oldTransaction.amount);
  }
  // Transaction Created
  else if (typeOfChange === 'create') {
    await updateAccountBalance(newTransaction.account, newTransaction.amount);
  }
  // Transaction Updated
  else {
    // Account was not changed
    if (newTransaction.account.id === oldTransaction.account.id) {
      amountChange = newTransaction.amount - oldTransaction.amount;
      await updateAccountBalance(newTransaction.account, amountChange);
    }
    // Account was changes
    else {
      await updateAccountBalance(newTransaction.account, newTransaction.amount);
      await updateAccountBalance(oldTransaction.account, -oldTransaction.amount);
    }
  }
});