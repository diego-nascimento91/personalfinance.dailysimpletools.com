import ExpensePerCategory from 'components/ExpensePerCategory/ExpensePerCategory';
import { handleFetchCategories, handleFetchTransactionsAll } from 'assets/functions/fetchFunctions';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useTransactionsAll } from 'assets/state/hooks/useTransactionsAll';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';

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
      handleFetchCategories('basicCategories', setCategories);
    }
  }, [user, loading]);

  return(
    <div className='theme__padding'>
      <ExpensePerCategory transactions={transactionsAll}/>
      <TransactionsSummary transactions={transactionsAll} allTransactions={true}/>
    </div>
  );
};

export default TransactionsPage;