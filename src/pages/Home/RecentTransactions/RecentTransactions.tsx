import { fetchTransactions } from 'assets/functions/fetchTransactions';
import { useTransactions } from 'assets/state/hooks/useTransactions';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecentTransactions.module.scss';
import TransactionSummary from './TransactionSummary/TransactionSummary';

const RecentTransactions = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [transactions, setTransactions] = useTransactions();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      const collectionPath = `users/${user.uid}/transactions`;
      fetchTransactions(collectionPath, setTransactions);
    }
  }, [user, loading]);

  return (
    <section className={`${styles.transactions__container} theme__homesections`}>
      <h2 className={styles.transactions__title}>Recent Transactions</h2>
      {
        transactions && transactions.length > 0  && transactions[0].id !== ''
          ? (
            transactions.map((transaction, index) => {
              if (index < 4) {
                return (
                  <TransactionSummary transaction={transaction} key={transaction.id} />
                );
              }
            })
          )
          : <p>No transactions added yet</p>
      }
    </section>
  );
};

export default RecentTransactions;