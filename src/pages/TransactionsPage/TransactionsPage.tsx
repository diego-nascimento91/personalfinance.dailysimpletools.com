import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFetchCategories, handleFetchTransactionsMonth } from 'assets/functions/fetchFunctions';
import { useCategories, useChosenMonth, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import ExpensePerCategory from 'components/ExpensePerCategory/ExpensePerCategory';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import NavBar from 'components/NavBar/NavBar';
import DatePicker from 'components/DatePicker/DatePicker';
import styles from './TransactionsPage.module.scss';
import AddTransactionButton from 'components/AddTransactionButton/AddTransactionButton';

const TransactionsPage = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [categories, setCategories] = useCategories();
  const [month] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleUpdateDBs();
    }
  }, [user, loading]);

  const handleUpdateDBs = () => {
    if (user) {
      if (!(categories && categories.length > 0)) {
        handleFetchCategories(user.uid, setCategories);
      }
      if (!(transactionsMonth && transactionsMonth.length > 0)) {
        handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
      }
    }
  };

  return (
    <div className={`theme__padding ${styles.transactionspage}`}>
      <div>
        <NavBar />
        <DatePicker />
        <ExpensePerCategory transactions={transactionsMonth} />
        <TransactionsSummary transactions={transactionsMonth} allTransactions={true} />
      </div>
      <AddTransactionButton />
    </div>
  );
};

export default TransactionsPage;