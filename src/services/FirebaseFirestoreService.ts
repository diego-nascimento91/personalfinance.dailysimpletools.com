import { addDoc, deleteDoc, collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, WhereFilterOp, limit, QueryConstraint, onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore';
import { db } from 'services/FirebaseConfig';
import { ITransaction, IQuery, ICategory, IOrderConfig, IAccount } from 'utils/interfaces';

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
    const newData = fixDates(data); // converts timestamp to Date before returning response

    // return data with its id
    return { id: result.id, ...newData };
  });
  return docs;
};

const readDocument = async (collectionPath: string, docPath: string) => {
  const result = await getDoc(doc(db, collectionPath, docPath));

  const data = result.data();
  const newData = fixDates(data); // converts timestamp to Date before returning response

  // return data with its id
  return { id: result.id, ...newData };
};

const readDocumentRef = async (docRef: DocumentReference<DocumentData>) => {
  const result = await getDoc(docRef);

  const data = result.data();
  const newData = fixDates(data); // converts timestamp to Date before returning response

  // return data with its id
  return { id: result.id, ...newData };
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

const docListener = (collectionPath: string, docKey: string, callback: () => void) => {
  return onSnapshot(doc(db, collectionPath, docKey), () => {
    callback();
  });
};

const fixDates = (data: DocumentData | undefined) => {
  const newData = { ...data };
  if (newData?.date) newData.date = new Date(newData.date.seconds * 1000);
  if (newData?.publishDate) newData.publishDate = new Date(newData.publishDate.seconds * 1000);

  return newData;
};

const FirebaseFirestoreService = {
  createDocument,
  docListener,
  readDocument,
  readDocumentRef,
  readAllDocsFromCollection,
  updateDocument,
  deleteDocument,
};
export default FirebaseFirestoreService;