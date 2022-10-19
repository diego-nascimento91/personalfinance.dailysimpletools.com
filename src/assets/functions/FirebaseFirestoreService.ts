import { addDoc, collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, WhereFilterOp, OrderByDirection, limit, QueryConstraint } from 'firebase/firestore';

import { db } from 'assets/functions/FirebaseConfig';
import { ITransaction, IQuery, ICategory } from 'assets/interfaces/interfaces';

const readAllDocsFromCollection = async (collectionPath: string, orderByField?: string, orderByDirection?: string, queries?: IQuery[], limitDocs?: number) => {
  // get constraints array
  const queriesConfig: QueryConstraint[] = [];
  if (queries && queries.length > 0) {
    queries.forEach(querie => {
      queriesConfig.push(where(querie.field, querie.condition as WhereFilterOp, querie.value));
    });
  }

  if (orderByField && orderByDirection) {
    queriesConfig.push(orderBy(orderByField, orderByDirection as OrderByDirection));
  }

  if (limitDocs) {
    queriesConfig.push(limit(limitDocs));
  }
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...queriesConfig);

  const results = await getDocs(q);

  // map results to attach id in the objects
  const docs = results.docs.map(result => {
    const data = result.data();

    // if there is a date field, it converts timestamp to Date before returning response
    if (data.date) data.date = new Date(data.date.seconds * 1000);
    if (data.publishDate) data.publishDate = new Date(data.publishDate.seconds * 1000);

    // return data with its id
    return { id: result.id, ...data };
  });
  return docs;
};

const readDocument = async (collectionPath: string, docPath: string) => {
  const result = await getDoc(doc(db, collectionPath, docPath));

  // converts timestamp to Date before returning response
  const data = result.data();
  if (data?.date) data.date = new Date(data.date.seconds * 1000);

  // return data with its id
  return { id: result.id, ...data };
};

const createDocument = async (collectionPath: string, document: ITransaction | ICategory, id?: string) => {
  if (id) {
    return setDoc(doc(db, collectionPath, id), document);
  } else {
    return addDoc(collection(db, collectionPath), document);
  }
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
    await setDoc(dbDoc, { ...transaction, id: id }, { merge: true });

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