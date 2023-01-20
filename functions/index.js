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
    .onWrite(async (change) => {

      // get current document
      const newTransaction = change.after.exists ? change.after.data() : null;
      const oldTransaction = change.before.exists ? change.before.data() : null;

      // function to update the account balance
      const updateAccountBalance = async (account, amount) => {
        // write code to update balance
        // **************************************************
        // const accountDoc = firestore.collection('users/{userId}/transactions').doc(transactionId);
        const accountDocRef= firestore.collection('users/{userId}/accounts/').doc(account.id);
        const accountDoc = await accountDocRef.get();
        console.log('** accountDoc:', accountDoc);

        if (accountDoc.exists) {
          accountDocRef.update({ count: admin.firestore.FieldValue.increment(amount) });
        } else {
          console.log('** doc not found');
        }
      };

      const typeOfChange = newTransaction === null ? 'delete' : oldTransaction === null ? 'create' : 'update';
      console.log('**type of change', typeOfChange);
      console.log('**');

      // Transaction Deleted
      if (typeOfChange === 'delete') {
        // getting values of deleted transaction
        const accountDeleted = oldTransaction.account;
        const typeTransactionDeleted = oldTransaction.type;
        const amountDeleted = -(typeTransactionDeleted === 'income' ? +Math.abs(oldTransaction.amount) : -Math.abs(oldTransaction.amount));
        // the minus sign is to revert the transaction, as this is a delete operation

        await updateAccountBalance(accountDeleted, amountDeleted);
        // console.log('**doc deleted - account', accountDeleted);
        // console.log('**doc deleted - account', amountDeleted);
      }
      // Transaction Created
      else if (typeOfChange === 'create') {
        // getting value of created transaction 
        const accountCreated = newTransaction.account;
        const typeTransactionCreated = newTransaction.type;
        const amountCreated = typeTransactionCreated === 'income' ? +Math.abs(newTransaction.amount) : -Math.abs(newTransaction.amount);

        await updateAccountBalance(accountCreated, amountCreated);
        // console.log('**doc created - account', accountCreated);
        // console.log('**doc created - amount', amountCreated);
      }
      // Transaction Updated
      else {
        // Getting previous values of updated transaction
        const oldAccount = oldTransaction.account;
        const oldTypeTransaction = oldTransaction.type;
        const oldAmount = -(oldTypeTransaction === 'income' ? +Math.abs(oldTransaction.amount) : -Math.abs(oldTransaction.amount));
        // the minus sign is to revert the transaction, as this is like a delete operation to the old account

        // Getting new values of updated transaction
        const newAccount = newTransaction.account;
        const newTypeTransaction = newTransaction.type;
        const newAmount = newTypeTransaction === 'income' ? +Math.abs(newTransaction.amount) : -Math.abs(newTransaction.amount);

        // Account was not updated
        if (newAccount.id === oldAccount.id) {
          amountDifference = newAmount + oldAmount; // its '+' because oldAmount has its sign already inverted in its own operation
          await updateAccountBalance(newAccount, amountDifference);
          // console.log('**doc updated (without changing account) - account', newAccount);
          // console.log('**doc updated (without changing account) - amount', amountDifference);

        }
        // Account was updated
        else {
          await updateAccountBalance(newAccount, newAmount);
          await updateAccountBalance(oldAccount, oldAmount);
          // console.log('**doc updated (changing account) - newAccount', newAccount);
          // console.log('**doc updated (changing account) - newAmount', newAmount);
          // console.log('**');
          // console.log('**doc updated (changing account) - oldAccount', oldAccount);
          // console.log('**doc updated (changing account) - oldAmount', oldAmount);
        }
      }
    });