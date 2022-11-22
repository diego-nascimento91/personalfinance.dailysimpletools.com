import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useCategories, useChosenMonth, useRecentTransactions, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import { handleFetchAccounts, handleFetchCategories, handleFetchRecentTransactions, handleFetchTransactionsMonth } from 'assets/functions/handleDatabaseFunctions';
import styles from './Home.module.scss';
import stylesPadding from 'assets/styles/padding.module.scss';
import stylesPages from 'assets/styles/pages.module.scss';
import AddTransactionButton from '../../components/AddTransactionButton/AddTransactionButton';
import TotalsPerCategory from '../../components/TotalsPerCategory/TotalsPerCategory';
import Overview from './Overview/Overview';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import UserHeader from 'components/UserHeader/UserHeader';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [recentTransactions, setRecentTransactions] = useRecentTransactions();
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
      if (!(categories && categories.length > 0)) {
        handleFetchCategories(setCategories, user.uid);
      }
      if (!(accounts && accounts.length > 0)) {
        handleFetchAccounts(setAccounts);
      }
      if (!(recentTransactions && recentTransactions.length > 0)) {
        handleFetchRecentTransactions(user.uid, setRecentTransactions);
      }
      if (!(transactionsMonth && transactionsMonth.length > 0)) {
        handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
      }
    }
  };

  return (
    <div className={`${stylesPadding.padding} ${stylesPages.pages}`}>
      <div className={styles.home__components}>
        <div className={styles.home__userHeader}><UserHeader /></div>
        <div className={styles.home__overview}><Overview /></div>
        <div className={styles.home__totalsPerCategory}><TotalsPerCategory transactions={transactionsMonth} /></div>
        <div className={styles.home__transactionsSummary}><TransactionsSummary transactions={recentTransactions} /></div>
      </div>
      <AddTransactionButton />
    </div>
  );
};

export default Home;