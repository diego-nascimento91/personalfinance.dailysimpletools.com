const functions = require('firebase-functions');
const admin = require('firebase-admin');

const apiFirebaseOptions = {
  credential: admin.credential.applicationDefault(),
  ...functions.config().firebase,
};

admin.initializeApp(apiFirebaseOptions);

const firestore = admin.firestore();
const settings = {
  timestampsInSnapshots: true
};

firestore.settings(settings);

module.exports = { functions, firestore};

