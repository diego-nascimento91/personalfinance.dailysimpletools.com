import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICategory, ITransaction } from 'assets/interfaces/interfaces';
import { newFetchFunction } from 'assets/functions/fetchFunctions';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useChosenMonth } from 'assets/state/hooks/useChosenMonth';
import { useTransactionsMonth } from 'assets/state/hooks/useTransactionsMonth';
import { useTransactionsAll } from 'assets/state/hooks/useTransactionsAll';
import { useUser } from 'assets/state/hooks/useUser';
import AddTransaction from '../../components/AddTransaction/AddTransaction';
import DatePicker from 'components/DatePicker/DatePicker';
import ExpensePerCategory from '../../components/ExpensePerCategory/ExpensePerCategory';
import NavBar from 'components/NavBar/NavBar';
import Overview from './Overview/Overview';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import Welcome from '../../components/Welcome/Welcome';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [transactionsAll, setTransactionsAll] = useTransactionsAll();
  const [, setCategories] = useCategories();
  const [month,] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchCategories();
      handleFetchTransactionsMonth();
      handleFetchTransactionsAll();
    }
  }, [user, loading, month]);

  const handleFetchCategories = async () => {
    if (user) {
      try {
        const categoriesDB = await newFetchFunction('categories', user.uid);
        setCategories(categoriesDB as ICategory[]);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };

  const handleFetchTransactionsMonth = async () => {
    if (user) {
      try {
        const transactionsDB = await newFetchFunction('transactions', user.uid, month);
        setTransactionsMonth(transactionsDB as ITransaction[]);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };

  const handleFetchTransactionsAll = async () => {
    if (user) {
      try {
        const limitDocs = 4;
        const transactionsDB = await newFetchFunction('transactions', user.uid, undefined, limitDocs);
        setTransactionsAll(transactionsDB as ITransaction[]);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };

  return (
    <div className='theme__padding'>
      <Welcome />
      <NavBar />
      <DatePicker />
      <Overview />
      <ExpensePerCategory transactions={transactionsMonth} />
      <TransactionsSummary transactions={transactionsAll} />
      <AddTransaction handleFetchTransactionsMonth={handleFetchTransactionsMonth} handleFetchTransactionsAll={handleFetchTransactionsAll} />
    </div>
  );
};

export default Home;