import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ITransaction, IQuery, ICategory } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';

// fetchTransactions function
interface Props {
  collectionPath: string, 
  setTransactions: SetterOrUpdater<ITransaction[]> | React.Dispatch<React.SetStateAction<ITransaction[]>>,
  queries?: IQuery[],
}
export const fetchTransactions = async (props: Props) => {
  const { collectionPath, setTransactions, queries } = props;

  try {
    const response = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, 'date', 'desc', queries);
    setTransactions(response as ITransaction[]);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      alert(error.message);
    }
  }
};


// call fetchTransactions with queries to get all transactions
export const handleFetchTransactionsAll = (collectionPath: string,  setTransactions: SetterOrUpdater<ITransaction[]> | React.Dispatch<React.SetStateAction<ITransaction[]>>) => {
  fetchTransactions( { collectionPath, setTransactions } );
};


// call fetchTransactions with queries to get all categories
export const handleFetchCategories = (collectionPath: string, setCategories: SetterOrUpdater<ICategory[]> | React.Dispatch<React.SetStateAction<ICategory[]>>) => {
  const orderByField = 'value';
  const orderByDirection = 'asc';
  FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderByField, orderByDirection)
    .then(response => {
      setCategories(response as ICategory[]);
    })
    .catch(error => {
      if (error instanceof Error) {
        alert(`Error Fetching Categories: ${error.message}`);
        throw error;
      }
    });
};


// call fetchTransactions with queries to get transactions from Month
export const handleFetchTransactionsMonth = (collectionPath: string, month: Date, setTransactionsMonth: SetterOrUpdater<ITransaction[]> | React.Dispatch<React.SetStateAction<ITransaction[]>>) => {
  const { firstDay, lastDay } = formatDate(month);
  const queries = getQueries(firstDay, lastDay);

  fetchTransactions({ collectionPath, setTransactions: setTransactionsMonth, queries });
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

const formatDate = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDay = new Date(year, month);
  const lastDay = new Date(year, month + 1, 0);

  return { firstDay, lastDay };
};