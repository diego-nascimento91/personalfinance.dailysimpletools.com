import styles from './Home.module.scss';
import TotalsPerCategory from '../../components/TotalsPerCategory/TotalsPerCategory';
import Overview from './Overview/Overview';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import UserHeader from 'components/UserHeader/UserHeader';
import AddPlusButton from 'components/AddPlusButton/AddPlusButton';
import PageWrapperLoggedIn from 'components/PageWrapperLoggedIn/PageWrapperLoggedIn';
import { useRecentTransactions, useTransactionsMonth } from 'assets/state/hooks/transactions';

const Home = () => {
  const [transactionsMonth] = useTransactionsMonth();
  const [recentTransactions] = useRecentTransactions();


  return (
    <PageWrapperLoggedIn>
      <div className={styles.home__components}>
        <div className={styles.home__userHeader}><UserHeader /></div>
        <div className={styles.home__overview}><Overview /></div>
        <div className={styles.home__totalsPerCategory}><TotalsPerCategory transactions={transactionsMonth} /></div>
        <div className={styles.home__transactionsSummary}><TransactionsSummary transactions={recentTransactions} /></div>
      </div>
      <AddPlusButton />
    </PageWrapperLoggedIn>
  );
};

export default Home;