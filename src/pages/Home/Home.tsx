import { fetchTransactions } from 'assets/functions/fetchTransactions';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ICategory, IQuery } from 'assets/interfaces/interfaces';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useTransactionsMonth } from 'assets/state/hooks/useTransactionsMonth';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransaction from './AddTransaction/AddTransaction';
import ExpensePerCategory from './ExpensePerCategory/ExpensePerCategory';
import Overview from './Overview/Overview';
import RecentTransactions from './RecentTransactions/RecentTransactions';
import Welcome from './Welcome/Welcome';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [, setTransactions] = useTransactionsMonth();
  const [month, setMonth] = useState(new Date());
  const [, setCategories] = useCategories();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchTransactions();
      handleFetchCategories();
    }
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

  const handleFetchCategories = () => {
    const orderByField = 'value';
    const orderByDirection = 'asc';
    const queries: IQuery[] = [];
    FirebaseFirestoreService.readAllDocsFromCollection('basicCategories', queries, orderByField, orderByDirection)
      .then(response => {
        setCategories(response as ICategory[]);
      })
      .catch(error => {
        if (error instanceof Error) {
          alert(`Error Fetching Categories: ${error.message}`);
          throw error;
        }
      });
  };

  return (
    <div className='theme__padding'>
      <Welcome month={month} setMonth={setMonth} />
      <Overview />
      <ExpensePerCategory />
      <RecentTransactions />
      <AddTransaction />
    </div>
  );
};

export default Home;