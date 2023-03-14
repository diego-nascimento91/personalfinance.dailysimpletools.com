import { useEffect } from 'react';
import styles from './PageWrapperLoggedIn.module.scss';
import { useNavigate } from 'react-router-dom';
import { handleFetchAccounts, handleFetchCategories, handleFetchOnlyUserCategories, handleFetchRecentTransactions, handleFetchTransactionsMonth } from 'assets/functions/handleDatabaseFunctions';
import stylesPadding from 'assets/styles/padding.module.scss';
import { useCategories, useUserCategories } from 'assets/state/hooks/categories';
import { useUser } from 'assets/state/hooks/user';
import { useChosenMonth, useRecentTransactions, useTransactionsMonth } from 'assets/state/hooks/transactions';
import { useAccounts } from 'assets/state/hooks/accounts';


interface Props {
  children: JSX.Element | JSX.Element[],
  customStyles?: string,
}
const PageWrapperLoggedIn = (props: Props) => {
  const { children, customStyles } = props;
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactionsMonth, setTransactionsMonth] = useTransactionsMonth();
  const [recentTransactions, setRecentTransactions] = useRecentTransactions();
  const [UserCategories, setUserCategories] = useUserCategories();
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
        handleFetchAccounts(setAccounts, user.uid);
      }
      if (!(recentTransactions && recentTransactions.length > 0)) {
        handleFetchRecentTransactions(user.uid, setRecentTransactions);
      }
      if (!(transactionsMonth && transactionsMonth.length > 0)) {
        handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
      }
      if (!(UserCategories && UserCategories.length > 0)) {
        handleFetchOnlyUserCategories(setUserCategories, user.uid);
      }
    }
  };

  return (
    <div className={`${styles.PageWrapperLoggedIn} ${stylesPadding.padding} ${customStyles}`}>
      {children}
    </div>
  );
};

export default PageWrapperLoggedIn;