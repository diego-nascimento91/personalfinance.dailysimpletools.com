import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleFetchAccounts, handleFetchCategories, handleFetchTransactionsMonth } from 'assets/functions/handleDatabaseFunctions';
import { useAccounts, useCategories, useChosenMonth, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './TransactionsPage.module.scss';
import stylesPadding from 'assets/styles/padding.module.scss';
import stylesPages from 'assets/styles/pages.module.scss';
import TotalsPerCategory from 'components/TotalsPerCategory/TotalsPerCategory';
import TransactionsSummary from 'components/TransactionsSummary/TransactionsSummary';
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
        handleFetchCategories(setCategories, user.uid);
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
    <div className={`${stylesPadding.padding} ${stylesPages.pages}`}>
      <div className={styles.transactionsPage__components}>
        <div className={styles.transactionsPage__userHeader}><UserHeader/></div>
        <div className={styles.transactionsPage__totalsPerCategory}><TotalsPerCategory transactions={transactionsMonth} allTransactions={true}/></div>
        <div className={styles.transactionsPage__transactionsSummary}><TransactionsSummary transactions={transactionsMonth} allTransactions={true} /></div>
      </div>
      <AddTransactionButton />
    </div>
  );
};

export default TransactionsPage;