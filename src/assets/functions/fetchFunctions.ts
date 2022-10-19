import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { IAccounts, ICategory, ITransaction } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';

// function handleFetchFunction (to be used for any call of fetchFunction)
export const fetchFunction = async (collectionName: string, userId: string, month?: Date, limitDocs?: number) => {
  // get collectionPath
  const collectionPath = getCollectionPath(collectionName, userId);
  // get fieldToBeOrdered and orderDirection according to collection name
  const [fieldToBeOrdered, orderDirection] = getOrderConfig(collectionName);
  // get queries by first and last day of month
  let queries;
  if (month) {
    const { firstDay, lastDay } = getFormatDate(month);
    queries = getQueries(firstDay, lastDay);
  }

  // const response = await fetchFunction(collectionPath, orderByField, orderByDirection, queries);
  const response = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, fieldToBeOrdered, orderDirection, queries, limitDocs);
  return response;
};

export const handleFetchCategories = async (setCategories: SetterOrUpdater<ICategory[]>) => {
  const collectionPath = 'categories';
  const [fieldToBeOrdered, orderDirection] = ['ordering', 'asc'];

  const categoriesDB = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, fieldToBeOrdered, orderDirection);
  setCategories(categoriesDB as ICategory[]);

  // fetchFunction('categories', userId)
  //   .then(categoriesDB => { setCategories(categoriesDB as ICategory[]); })
  //   .catch(error => {
  //     alert(error.message);
  //     throw error;
  //   });
};

export const handleFetchAccounts = (userId: string, setAccounts: SetterOrUpdater<IAccounts[]>) => {
  fetchFunction('accounts', userId)
    .then(accountsDB => { setAccounts(accountsDB as IAccounts[]); })
    .catch(error => {
      alert(error.message);
      throw error;
    });
};

export const handleFetchRecentTransactions = (userId: string, setTransactionsAll: SetterOrUpdater<ITransaction[]>) => {
  const limitDocs = 4;
  fetchFunction('transactions', userId, undefined, limitDocs)
    .then(transactionAll => { setTransactionsAll(transactionAll as ITransaction[]); })
    .catch(error => {
      alert(error.message);
      throw error;
    });
};

export const handleFetchTransactionsMonth = (userId: string, setTransactionsMonth: SetterOrUpdater<ITransaction[]>, month: Date) => {
  fetchFunction('transactions', userId, month)
    .then(transactionsMonth => { setTransactionsMonth(transactionsMonth as ITransaction[]); })
    .catch(error => {
      alert(error.message);
      throw error;
    });
};

export const handleCreateDocFunction = async (collectionName: string, userId: string, document: ITransaction) => {
  try {
    const collectionPath = getCollectionPath(collectionName, userId);
    await FirebaseFirestoreService.createDocument(collectionPath, document);
    alert('Document added successfully!');
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleUpdateDocFunction = async (collectionName: string, userId: string, document: ITransaction) => {
  try {
    const collectionPath = getCollectionPath(collectionName, userId);
    if (document.id) {
      const docId = document.id;
      delete document.id;
      await FirebaseFirestoreService.updateDocument(collectionPath, document, docId);
      alert('Document updated successfully!');
    } else {
      throw new Error('Missing document ID');
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleDeleteDocFunction = async (collectionName: string, userId: string, document: ITransaction) => {
  try {
    const deleteConfirmation = window.confirm(`Are you sure you want to delete this document from your ${collectionName}? Ok for Yes. Cancel for No.`);
    if (deleteConfirmation) {
      const collectionPath = getCollectionPath(collectionName, userId);
      if (document.id) {
        await FirebaseFirestoreService.deleteDocument(collectionPath, document.id);
        alert('Document deleted successfully!');
      } else {
        throw new Error('Missing document ID');
      }
    } else {
      throw new Error('Document deletion cancelled');
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

// helper functions
const getCollectionPath = (collectionName: string, userId: string) => {
  let collectionPath;
  if (collectionName === 'categories') {
    collectionPath = 'categories';
  } else if (collectionName === 'transactions') {
    collectionPath = `users/${userId}/transactions`;
  } else if (collectionName === 'accounts') {
    collectionPath = 'accounts';
  } else {
    throw Error('Missing/wrong collection name');
  }

  return collectionPath;
};

const getFormatDate = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month);
  const lastDay = new Date(year, month + 1, 0);

  return { firstDay, lastDay };
};

const getOrderConfig = (collectionName: string) => {
  let fieldToBeOrdered, orderDirection;

  if (collectionName === 'categories') {
    fieldToBeOrdered = 'ordering';
    orderDirection = 'asc';
  } else if (collectionName === 'transactions') {
    fieldToBeOrdered = 'date';
    orderDirection = 'desc';
  } else if (collectionName === 'accounts') {
    fieldToBeOrdered = 'value';
    orderDirection = 'asc';
  } else {
    throw Error('Missing/wrong collection name');
  }

  return [fieldToBeOrdered, orderDirection];
};

const getQueries = (firstDay: Date, lastDay: Date) => {
  const queries = [];
  queries.push({
    field: 'date',
    condition: '>=',
    value: firstDay
  });
  queries.push({
    field: 'date',
    condition: '<=',
    value: lastDay
  });
  return queries;
};