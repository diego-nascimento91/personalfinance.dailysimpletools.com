import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, WhereFilterOp, limit, QueryConstraint } from 'firebase/firestore';

import { db } from 'assets/functions/FirebaseConfig';
import { ITransaction, IQuery, ICategory, IOrderConfig, IAccount } from 'assets/interfaces/interfaces';

const readAllDocsFromCollection = async (collectionPath: string, orderConfigs: IOrderConfig[], queries?: IQuery[], limitDocs?: number) => {
  // get constraints array
  const queriesConfig: QueryConstraint[] = [];
  if (queries && queries.length > 0) {
    queries.forEach(item => {
      queriesConfig.push(where(item.field, item.condition as WhereFilterOp, item.value));
    });
  }

  if (orderConfigs && orderConfigs.length > 0) {
    orderConfigs.forEach(item => {
      queriesConfig.push(orderBy(item.fieldName, item.orderDirection));
    });
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

const createDocument = async (collectionPath: string, document: ITransaction | ICategory | IAccount, id?: string) => {
  if (id) {
    return await setDoc(doc(db, collectionPath, id), document);
  } else {
    return await addDoc(collection(db, collectionPath), document);
  }
};

const deleteDocument = async (collectionPath: string, id: string) => {
  return await deleteDoc(doc(db, collectionPath, id));
};

const updateDocument = async (collectionPath: string, document: ITransaction | ICategory | IAccount, id: string) => {
  return await setDoc(doc(db, collectionPath, id), document, { merge: true });
};

const FirebaseFirestoreService = {
  createDocument,
  readDocument,
  readAllDocsFromCollection,
  updateDocument,
  deleteDocument,
};
export default FirebaseFirestoreService;