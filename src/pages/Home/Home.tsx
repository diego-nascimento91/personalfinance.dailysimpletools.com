import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions, handleFetchCategories, handleFetchTransactionsAll } from 'assets/functions/fetchFunctions';
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
  const [month, setMonth] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchCategories('basicCategories', setCategories);
      handleFetchTransactionsMonth();
      handleFetchTransactionsAll(`users/${user?.uid}/transactions`, setTransactionsAll);
    }
  }, [user, loading, month]);

  const handleFetchTransactionsMonth = () => {
    const { firstDay, lastDay } = formatDate(month);
    const queries = getQueries(firstDay, lastDay);

    const collectionPath = `users/${user?.uid}/transactions`;
    fetchTransactions({ collectionPath, setTransactions: setTransactionsMonth, queries });
  };

  const getQueries = (firstDay: Date, lastDay: Date) => {
    const queries = [];
    queries.push({
      field: 'date',
      condition: '>=',
      value: firstDay
    });
    queries.push({
      field: 'date',
      condition: '<=',
      value: lastDay
    });
    return queries;
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month);
    const lastDay = new Date(year, month + 1, 0);

    return { firstDay, lastDay };
  };

  return (
    <div className='theme__padding'>
      <Welcome />
      <NavBar />
      <DatePicker month={month} setMonth={setMonth} />
      <Overview />
      <ExpensePerCategory transactions={ transactionsMonth } />
      <TransactionsSummary transactions = { transactionsAll }/>
      <AddTransaction handleFetchTransactionsMonth={handleFetchTransactionsMonth} />
    </div>
  );
};

export default Home;