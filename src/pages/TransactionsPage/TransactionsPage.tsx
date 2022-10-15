import ExpensePerCategory from 'components/ExpensePerCategory/ExpensePerCategory';
import { handleFetchCategories, handleFetchTransactionsMonth } from 'assets/functions/fetchFunctions';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import NavBar from 'components/NavBar/NavBar';
import { useTransactionsMonth } from 'assets/state/hooks/useTransactionsMonth';
import { useChosenMonth } from 'assets/state/hooks/useChosenMonth';
import DatePicker from 'components/DatePicker/DatePicker';

const TransactionsPage = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [, setCategories] = useCategories();
  const [month] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchCategories('basicCategories', setCategories);
      handleFetchTransactionsMonth(`users/${user?.uid}/transactions`, month, setTransactionsMonth);
    }
  }, [user, loading, month]);

  return(
    <div className='theme__padding'>
      <NavBar />
      <DatePicker />
      <ExpensePerCategory transactions={transactionsMonth}/>
      <TransactionsSummary transactions={transactionsMonth} allTransactions={true}/>
    </div>
  );
};

export default TransactionsPage;