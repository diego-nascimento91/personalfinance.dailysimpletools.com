import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newFetchFunction } from 'assets/functions/fetchFunctions';
import { ICategory, ITransaction } from 'assets/interfaces/interfaces';
import { useCategories, useChosenMonth, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import ExpensePerCategory from 'components/ExpensePerCategory/ExpensePerCategory';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import NavBar from 'components/NavBar/NavBar';
import DatePicker from 'components/DatePicker/DatePicker';

const TransactionsPage = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [, setCategories] = useCategories();
  const [month] = useChosenMonth();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleFetchCategories();
      handleFetchTransactionsMonth();
    }
  }, [user, loading, month]);

  const handleFetchCategories = async () => {
    try {
      if (user) {
        const categoriesDB = await newFetchFunction('categories', user.uid);
        setCategories(categoriesDB as ICategory[]);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        throw error;
      }
    }
  };

  const handleFetchTransactionsMonth = async () => {
    try {
      if (user) {
        const transactionsDB = await newFetchFunction('transactions', user.uid, month);
        setTransactionsMonth(transactionsDB as ITransaction[]);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        throw error;
      }
    }
  };

  return(
    <div className='theme__padding'>
      <NavBar />
      <DatePicker />
      <ExpensePerCategory transactions={transactionsMonth}/>
      <TransactionsSummary transactions={transactionsMonth} allTransactions={true}/>
    </div>
  );
};

export default TransactionsPage;