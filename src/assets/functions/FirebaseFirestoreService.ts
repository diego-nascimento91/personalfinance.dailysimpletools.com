import { addDoc, collection, doc, getDoc, getDocs, setDoc} from 'firebase/firestore';
import { db } from 'assets/functions/FirebaseConfig';
import { ITransaction } from 'assets/interfaces/interfaces';

const readAllDocsFromCollection = async (collectionPath: string) => {
  const results = await getDocs(collection(db, collectionPath));

  // map results to attach id in the objects
  const docs = results.docs.map(result => {
    const data = result.data();

    // converts timestamp to Date before returning response
    if(data.date) data.date = new Date(data.date.seconds * 1000);
    
    // return data with its id
    return { id: result.id, ...data };
  });
  return docs;
};

const readDocument = async (collectionPath: string, docPath: string) => {
  const result = await getDoc(doc(db, collectionPath, docPath));

  // converts timestamp to Date before returning response
  const data = result.data();
  if(data?.date) data.date = new Date(data.date.seconds * 1000);

  // return data with its id
  return { id: result.id, ...data };
};

const createDocument = async (collectionPath: string, document: ITransaction) => {
  return addDoc(collection(db, collectionPath), document);
};

// it has to be checked if it is working
const updateTransaction = async (transaction: {
  paymentMethod: string;
  place: string;
  price: number;
  date: string;
  category: string;
  description: string;
}, id: number) => {
  try {
    const dbDoc = doc(db, 'transactions', 'teste02');
    await setDoc(dbDoc, { ...transaction, id: id }, { merge: true } );

  } catch (err) {
    console.error(err);
    alert('An error occured while fetching user data');
  }
};

const FirebaseFirestoreService = {
  createDocument,
  readDocument,
  readAllDocsFromCollection,
  updateTransaction,
};
export default FirebaseFirestoreService;