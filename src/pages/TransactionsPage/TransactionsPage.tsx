import ExpensePerCategory from 'components/ExpensePerCategory/ExpensePerCategory';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { handleFetchTransactionsAll } from 'assets/functions/fetchFunctions';
import { ICategory, IQuery } from 'assets/interfaces/interfaces';
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
      handleFetchTransactionsAll(`users/${user?.uid}/transactions`, setTransactionsAll);
      handleFetchCategories();
    }
  }, [user, loading]);

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