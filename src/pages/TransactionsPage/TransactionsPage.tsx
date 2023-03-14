import styles from './TransactionsPage.module.scss';
import TotalsPerCategory from 'components/TotalsPerCategory/TotalsPerCategory';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
import UserHeader from 'components/UserHeader/UserHeader';
import AddPlusButton from 'components/AddPlusButton/AddPlusButton';
import PageWrapperLoggedIn from 'components/PageWrapperLoggedIn/PageWrapperLoggedIn';
import { useTransactionsMonth } from 'assets/state/hooks/transactions';

const TransactionsPage = () => {
  const [transactionsMonth,] = useTransactionsMonth();


  return (
    <PageWrapperLoggedIn>
      <div className={styles.transactionsPage__components}>
        <div className={styles.transactionsPage__userHeader}>
          <UserHeader />
        </div>
        <div className={styles.transactionsPage__totalsPerCategory}>
          <TotalsPerCategory transactions={transactionsMonth} allTransactions={true} />
        </div>
        <div className={styles.transactionsPage__transactionsSummary}><TransactionsSummary transactions={transactionsMonth} allTransactions={true} />
        </div>
      </div>
      <AddPlusButton />
    </PageWrapperLoggedIn>
  );
};

export default TransactionsPage;