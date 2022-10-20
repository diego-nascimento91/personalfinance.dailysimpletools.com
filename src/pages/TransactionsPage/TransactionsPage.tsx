import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFetchAccounts, handleFetchCategories, handleFetchTransactionsMonth } from 'assets/functions/handleDatabaseFunctions';
import { useAccounts, useCategories, useChosenMonth, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import ExpensePerCategory from 'components/ExpensePerCategory/ExpensePerCategory';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import styles from './TransactionsPage.module.scss';
import AddTransactionButton from 'components/AddTransactionButton/AddTransactionButton';
import UserHeader from 'components/UserHeader/UserHeader';

const TransactionsPage = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [categories, setCategories] = useCategories();
  const [month] = useChosenMonth();
  const[accounts, setAccounts] = useAccounts();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleUpdateDBs();
    }
  }, [user, loading]);

  const handleUpdateDBs = () => {
    if (user) {
      if (!(categories && categories.length > 0)) {
        handleFetchCategories(setCategories);
      }
      if(!(accounts && accounts.length > 0)){
        handleFetchAccounts(setAccounts);
      }
      if (!(transactionsMonth && transactionsMonth.length > 0)) {
        handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
      }
    }
  };

  return (
    <div className={`theme__padding theme__page ${styles.transactionspage}`}>
      <div>
        <UserHeader/>
        <ExpensePerCategory transactions={transactionsMonth} />
        <TransactionsSummary transactions={transactionsMonth} allTransactions={true} />
      </div>
      <AddTransactionButton />
    </div>
  );
};

export default TransactionsPage;