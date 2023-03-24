import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { ITransaction } from 'utils/interfaces';
import { useLastAddedTransactions } from 'state/hooks/lastAddedTransactions';
import { useUser } from 'state/hooks/user';
import { getDateQueries, getOrderConfig } from 'state/utils/transactions';

export const useFetchLastAddedTransactions = () => {
  const [lastAddedTransactions, setLastAddedTransactions] = useLastAddedTransactions();
  const [user] = useUser();

  return async () => {
    if (lastAddedTransactions.length === 0 && user) {
      const collectionPath = `users/${user.uid}/transactions`;
      const orderConfig = getOrderConfig();
      const query = getDateQueries(new Date());

      try {
        const data = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPath, orderConfig, query);
        setLastAddedTransactions(data as ITransaction[]);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};