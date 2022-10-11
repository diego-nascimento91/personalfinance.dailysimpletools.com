import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ITransaction, Query } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';

interface Props {
  collectionPath: string, 
  setTransactions: SetterOrUpdater<ITransaction[]>,
  queries?: Query[],
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