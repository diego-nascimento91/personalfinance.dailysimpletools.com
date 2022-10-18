import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useCategories, useChosenMonth, useTransactionsAll, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import { handleFetchAccounts, handleFetchCategories, handleFetchRecentTransactions, handleFetchTransactionsMonth } from 'assets/functions/fetchFunctions';
import AddTransactionButton from '../../components/AddTransactionButton/AddTransactionButton';
import DatePicker from 'components/DatePicker/DatePicker';
import ExpensePerCategory from '../../components/ExpensePerCategory/ExpensePerCategory';
import NavBar from 'components/NavBar/NavBar';
import Overview from './Overview/Overview';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import Welcome from '../../components/Welcome/Welcome';
import styles from './Home.module.scss';
import AddTransactionForm from 'components/AddTransactionForm/AddTransactionForm';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [transactionsAll, setTransactionsAll] = useTransactionsAll();
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
        handleFetchCategories(user.uid, setCategories);
      }
      if(!(accounts && accounts.length > 0)){
        handleFetchAccounts(user.uid, setAccounts);
      }
      if(!(transactionsAll && transactionsAll.length > 0)) {
        handleFetchRecentTransactions(user.uid, setTransactionsAll);
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
        <TransactionsSummary transactions={transactionsAll} />
      </div>
      <AddTransactionButton />
      <AddTransactionForm />
    </div>
  );
};

export default Home;