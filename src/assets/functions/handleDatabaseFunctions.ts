import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { IAccounts, ICategory, IOrderConfig, IQuery, ITransaction } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';

export const handleFetchCategories = async (setCategories: SetterOrUpdater<ICategory[]>) => {
  const collectionPath = 'categories';
  const orderConfig: IOrderConfig[] = [{fieldName: 'ordering', orderDirection: 'asc'}];

  try {
    const categoriesDB = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderConfig);
    setCategories(categoriesDB as ICategory[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleFetchAccounts = async (setAccounts: SetterOrUpdater<IAccounts[]>) => {
  const collectionPath = 'accounts';
  const orderConfig: IOrderConfig[] = [{fieldName: 'value', orderDirection: 'asc'}];

  try {
    const accountsDB = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderConfig);
    setAccounts(accountsDB as IAccounts[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleFetchRecentTransactions = async (userId: string, setRecentTransactions: SetterOrUpdater<ITransaction[]>) => {
  const collectionPath = `users/${userId}/transactions`;
  const orderConfig: IOrderConfig[] = [
    {
      fieldName: 'date', 
      orderDirection: 'desc'
    },
    {
      fieldName: 'publishDate', 
      orderDirection: 'desc'
    },
  ];
  const queries: IQuery[] = [];
  const limitDocs = 4;

  try {
    const recentTransactions = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderConfig, queries,limitDocs);
    setRecentTransactions(recentTransactions as ITransaction[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleFetchTransactionsMonth = async (userId: string, setTransactionsMonth: SetterOrUpdater<ITransaction[]>, month: Date) => {
  const collectionPath = `users/${userId}/transactions`;
  const orderConfig: IOrderConfig[] = [
    {
      fieldName: 'date', 
      orderDirection: 'desc'
    },
    {
      fieldName: 'publishDate', 
      orderDirection: 'desc'
    },
  ];
  const { firstDay, lastDay } = getFormatDate(month);
  const  queries = getQueries(firstDay, lastDay);

  try {
    const transactionsMonth = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderConfig, queries);
    setTransactionsMonth(transactionsMonth as ITransaction[]);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
      throw error;
    }
  }
};

export const handleCreateDocFunction = async (collectionName: string, userId: string, document: ITransaction | ICategory) => {
  try {
    const collectionPath = `users/${userId}/${collectionName}`;
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
    const collectionPath = `users/${userId}/${collectionName}`;
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
      const collectionPath = `users/${userId}/${collectionName}`;
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