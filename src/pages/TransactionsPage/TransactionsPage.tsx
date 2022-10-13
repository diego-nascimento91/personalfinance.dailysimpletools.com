import ExpensePerCategory from 'components/ExpensePerCategory/ExpensePerCategory';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { fetchTransactions } from 'assets/functions/fetchTransactions';
import { ICategory, IQuery, ITransaction } from 'assets/interfaces/interfaces';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useTransactionsAll } from 'assets/state/hooks/useTransactionsAll';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionsPage = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsAll, setTransactionsAll] = useTransactionsAll();
  const [, setCategories] = useCategories();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchTransactionsAll();
      handleFetchCategories();
    }
  }, [user, loading]);

  const handleFetchTransactionsAll = () => {
    const collectionPath = `users/${user?.uid}/transactions`;
    interface Props {
      collectionPath: string,
      setTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>
    }
    const props = {
      collectionPath,
      setTransactions: setTransactionsAll
    };
    fetchTransactions(props as Props);
  };

  const handleFetchCategories = () => {
    const orderByField = 'value';
    const orderByDirection = 'asc';
    const queries: IQuery[] = [];
    FirebaseFirestoreService.readAllDocsFromCollection('basicCategories', queries, orderByField, orderByDirection)
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

  return(
    <div className='theme__padding'>
      <ExpensePerCategory transactions={transactionsAll}/>
    </div>
  );
};

export default TransactionsPage;