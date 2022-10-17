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
  console.log('Subcollections and documents deleted successfully!')
});
