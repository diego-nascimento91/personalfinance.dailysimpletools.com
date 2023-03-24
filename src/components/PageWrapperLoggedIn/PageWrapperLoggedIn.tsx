import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'state/hooks/user';
import { useTransactionsFilter_byMonth } from 'state/hooks/transactions';
import { useFetchLastAddedTransactions } from 'state/reducers/lastAddedTransactions';
import { useFetchTransactionsMonth } from 'state/reducers/transactions';
import { useFetchAccounts } from 'state/reducers/accounts';
import { useFetchCategories } from 'state/reducers/categories';
import styles from './PageWrapperLoggedIn.module.scss';
import stylesPadding from 'styles/padding.module.scss';


interface Props {
  children: JSX.Element | JSX.Element[],
  customStyles?: string,
}
const PageWrapperLoggedIn = (props: Props) => {
  const { children, customStyles } = props;
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [month] = useTransactionsFilter_byMonth();

  const fetchLastAddedTransactions = useFetchLastAddedTransactions();
  const fetchTransactionsMonth = useFetchTransactionsMonth();
  const fetchAccounts = useFetchAccounts();
  const fetchCategories = useFetchCategories();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      fetchLastAddedTransactions();
      fetchAccounts();
      fetchCategories();
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchTransactionsMonth();
  }, [month]);


  return (
    <div className={`${styles.PageWrapperLoggedIn} ${stylesPadding.padding} ${customStyles}`}>
      {children}
    </div>
  );
};

export default PageWrapperLoggedIn;