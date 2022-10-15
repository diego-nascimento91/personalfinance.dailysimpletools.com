import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFetchCategories, handleFetchTransactionsAll, handleFetchTransactionsMonth } from 'assets/functions/fetchFunctions';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useChosenMonth } from 'assets/state/hooks/useChosenMonth';
import { useTransactionsMonth } from 'assets/state/hooks/useTransactionsMonth';
import { useTransactionsAll } from 'assets/state/hooks/useTransactionsAll';
import { useUser } from 'assets/state/hooks/useUser';
import AddTransaction from './AddTransaction/AddTransaction';
import ExpensePerCategory from '../../components/ExpensePerCategory/ExpensePerCategory';
import Overview from './Overview/Overview';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import Welcome from '../../components/Welcome/Welcome';
import NavBar from 'components/NavBar/NavBar';
import DatePicker from 'components/DatePicker/DatePicker';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [transactionsAll, setTransactionsAll] = useTransactionsAll();
  const [, setCategories] = useCategories();
  const [month, ] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchCategories('basicCategories', setCategories);
      handleCallFetchTransactionsMonth();
      handleFetchTransactionsAll(`users/${user?.uid}/transactions`, setTransactionsAll);
    }
  }, [user, loading, month]);

  const handleCallFetchTransactionsMonth = () => {
    handleFetchTransactionsMonth(`users/${user?.uid}/transactions`, month, setTransactionsMonth);
  };

  return (
    <div className='theme__padding'>
      <Welcome />
      <NavBar />
      <DatePicker />
      <Overview />
      <ExpensePerCategory transactions={ transactionsMonth } />
      <TransactionsSummary transactions = { transactionsAll }/>
      <AddTransaction handleFetchTransactionsMonth={handleCallFetchTransactionsMonth} />
    </div>
  );
};

export default Home;