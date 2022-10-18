import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAccounts, ICategory, ITransaction } from 'assets/interfaces/interfaces';
import { useAccounts, useCategories, useChosenMonth, useTransactionsAll, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import { newFetchFunction } from 'assets/functions/fetchFunctions';
import AddTransaction from '../../components/AddTransaction/AddTransaction';
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
  const [transactionsAll, setTransactionsAll] = useTransactionsAll();
  const [, setCategories] = useCategories();
  const [, setAccounts] = useAccounts();
  const [month,] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchCategories();
      handleUpdateTransactions();
    }
  }, [user, loading, month]);

  const handleFetchCategories = () => {
    if (user) {
      newFetchFunction('categories', user.uid)
        .then(categoriesDB => { setCategories(categoriesDB as ICategory[]); })
        .catch(error => {
          alert(error.message);
          throw error;
        });

      newFetchFunction('accounts', user.uid)
        .then(accountsDB => { setAccounts(accountsDB as IAccounts[]); })
        .catch(error => {
          alert(error.message);
          throw error;
        });
    }
  };

  const handleUpdateTransactions = () => {
    if (user) {
      newFetchFunction('transactions', user.uid, month)
        .then(transactionsMonth => { setTransactionsMonth(transactionsMonth as ITransaction[]); })
        .catch(error => {
          alert(error.message);
          throw error;
        });

      const limitDocs = 4;
      newFetchFunction('transactions', user.uid, undefined, limitDocs)
        .then(transactionAll => { setTransactionsAll(transactionAll as ITransaction[]); })
        .catch(error => {
          alert(error.message);
          throw error;
        });
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
      <AddTransaction handleUpdateTransactions={handleUpdateTransactions} />
    </div>
  );
};

export default Home;