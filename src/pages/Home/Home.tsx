import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useCategories, useChosenMonth, useRecentTransactions, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import { handleFetchAccounts, handleFetchCategories, handleFetchRecentTransactions, handleFetchTransactionsMonth } from 'assets/functions/handleDatabaseFunctions';
import AddTransactionButton from '../../components/AddTransactionButton/AddTransactionButton';
import DatePicker from 'components/DatePicker/DatePicker';
import ExpensePerCategory from '../../components/ExpensePerCategory/ExpensePerCategory';
import NavBar from 'components/NavBar/NavBar';
import Overview from './Overview/Overview';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import Welcome from '../../components/Welcome/Welcome';
import styles from './Home.module.scss';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [recentTransactions, setRecentTransactions] = useRecentTransactions();
  const [categories, setCategories] = useCategories();
  const [accounts, setAccounts] = useAccounts();
  const [month,] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleUpdateDBs();
    }
  }, [user, loading]);

  const handleUpdateDBs = () => {
    if (user) {
      if(!(categories && categories.length > 0)){
        handleFetchCategories(setCategories);
      }
      if(!(accounts && accounts.length > 0)){
        handleFetchAccounts(setAccounts);
      }
      if(!(recentTransactions && recentTransactions.length > 0)) {
        handleFetchRecentTransactions(user.uid, setRecentTransactions);
      }
      if(!(transactionsMonth && transactionsMonth.length > 0)){
        handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
      }
    } 
  };

  return (
    <div className={`theme__padding ${styles.homepage}`}>
      <div>
        <Welcome />
        <NavBar />
        <DatePicker />
        <Overview />
        <ExpensePerCategory transactions={transactionsMonth} />
        <TransactionsSummary transactions={recentTransactions} />
      </div>
      <AddTransactionButton />
    </div>
  );
};

export default Home;