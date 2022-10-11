import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ITransaction } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';


export const fetchTransactions = async (collectionPath: string, setTransactions: SetterOrUpdater<ITransaction[]>) => {
  try {
    const response = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath);
    setTransactions(response as ITransaction[]);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      alert(error.message);
    }
  }
};