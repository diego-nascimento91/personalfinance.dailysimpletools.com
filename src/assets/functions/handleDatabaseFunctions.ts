import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { IAccounts, ICategory, IQuery, ITransaction } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';

export const handleFetchCategories = async (setCategories: SetterOrUpdater<ICategory[]>) => {
  const collectionPath = getCollectionPath('categories');
  const [fieldToBeOrdered, orderDirection] = ['ordering', 'asc'];

  try {
    const categoriesDB = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, fieldToBeOrdered, orderDirection);
    setCategories(categoriesDB as ICategory[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleFetchAccounts = async (setAccounts: SetterOrUpdater<IAccounts[]>) => {
  const collectionPath = getCollectionPath('accounts');
  const [fieldToBeOrdered, orderDirection] = ['value', 'asc'];

  try {
    const accountsDB = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, fieldToBeOrdered, orderDirection);
    setAccounts(accountsDB as IAccounts[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleFetchRecentTransactions = async (userId: string, setRecentTransactions: SetterOrUpdater<ITransaction[]>) => {
  const collectionPath = getCollectionPath('transactions', userId);
  const [fieldToBeOrdered, orderDirection] = ['date', 'desc'];
  const queries: IQuery[] = [];
  const limitDocs = 4;

  try {
    const recentTransactions = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, fieldToBeOrdered, orderDirection, queries,limitDocs);
    setRecentTransactions(recentTransactions as ITransaction[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleFetchTransactionsMonth = async (userId: string, setTransactionsMonth: SetterOrUpdater<ITransaction[]>, month: Date) => {
  const collectionPath = getCollectionPath('transactions', userId);
  const [fieldToBeOrdered, orderDirection] = ['date', 'desc'];
  const { firstDay, lastDay } = getFormatDate(month);
  const  queries = getQueries(firstDay, lastDay);

  try {
    const transactionsMonth = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, fieldToBeOrdered, orderDirection, queries);
    setTransactionsMonth(transactionsMonth as ITransaction[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
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
const getCollectionPath = (collectionName: string, userId?: string) => {
  let collectionPath;
  if (collectionName === 'categories') {
    collectionPath = 'categories';
  } else if (collectionName === 'transactions' && userId) {
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