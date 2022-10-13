import { fetchTransactions } from 'assets/functions/fetchFunctions';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ICategory, IQuery, ITransaction } from 'assets/interfaces/interfaces';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useTransactionsMonth } from 'assets/state/hooks/useTransactionsMonth';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransaction from './AddTransaction/AddTransaction';
import ExpensePerCategory from '../../components/ExpensePerCategory/ExpensePerCategory';
import Overview from './Overview/Overview';
import RecentTransactions from './RecentTransactions/RecentTransactions';
import Welcome from './Welcome/Welcome';
import { useTransactionsAll } from 'assets/state/hooks/useTransactionsAll';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [transactionsAll, setTransactionsAll] = useTransactionsAll();
  const [, setCategories] = useCategories();
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchCategories();
      handleFetchTransactionsMonth();
      handleFetchTransactionsAll();
    }
  }, [user, loading, month]);

  const handleFetchTransactionsAll = () => {
    const collectionPath = `users/${user?.uid}/transactions`;
    interface Props {
      collectionPath: string,
      setTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>
    }
    const props = {
      collectionPath,
      setTransactions: setTransactionsAll
    };
    fetchTransactions(props as Props);
  };

  const handleFetchTransactionsMonth = () => {
    const { firstDay, lastDay } = formatDate(month);
    const queries = getQueries(firstDay, lastDay);

    const collectionPath = `users/${user?.uid}/transactions`;
    const props = {
      collectionPath,
      setTransactions: setTransactionsMonth,
      queries
    };
    fetchTransactions(props);
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
      <ExpensePerCategory transactions={ transactionsMonth } />
      <RecentTransactions transactions = { transactionsAll }/>
      <AddTransaction handleFetchTransactionsMonth={handleFetchTransactionsMonth} handleFetchTransactionsAll={handleFetchTransactionsAll}/>
    </div>
  );
};

export default Home;