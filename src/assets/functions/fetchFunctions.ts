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
    const response = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, queries, 'date', 'desc');
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
  FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, undefined, orderByField, orderByDirection)
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