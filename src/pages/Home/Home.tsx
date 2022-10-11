import { fetchTransactions } from 'assets/functions/fetchTransactions';
import { useTransactions } from 'assets/state/hooks/useTransactions';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransaction from './AddTransaction/AddTransaction';
import Overview from './Overview/Overview';
import RecentTransactions from './RecentTransactions/RecentTransactions';
import Welcome from './Welcome/Welcome';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [,setTransactions] = useTransactions();
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) handleFetchTransactions();
  }, [user, loading, month]);

  const handleFetchTransactions = () => {
    const { firstDay, lastDay } = formatDate(month);
    const queries = getQueries(firstDay, lastDay);

    const collectionPath = `users/${user?.uid}/transactions`;
    fetchTransactions({ collectionPath, setTransactions, queries });
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
      <Welcome month={month} setMonth={setMonth} />
      <Overview />
      <RecentTransactions />
      <AddTransaction />
    </div>
  );
};

export default Home;