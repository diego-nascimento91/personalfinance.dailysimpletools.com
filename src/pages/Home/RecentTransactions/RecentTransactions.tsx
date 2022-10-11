import { fetchTransactions } from 'assets/functions/fetchTransactions';
import { ITransaction } from 'assets/interfaces/interfaces';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import styles from './RecentTransactions.module.scss';
import TransactionSummary from './TransactionSummary/TransactionSummary';

const RecentTransactions = () => {
  const [user, loading] = useUser();
  const [transactions, setTransactions] = useState<ITransaction[]>();

  useEffect(() => {
    if (user) handleFetchTransactions();
  }, [user, loading]);

  const handleFetchTransactions = () => {
    const collectionPath = `users/${user?.uid}/transactions`;
    interface Props {
      collectionPath: string,
      setTransactions: React.Dispatch<React.SetStateAction<ITransaction[]>>
    }
    fetchTransactions({ collectionPath, setTransactions } as Props);
  };

  return (
    <section className={`${styles.transactions__container} theme__homesections`}>
      <h2 className={styles.transactions__title}>Recent Transactions</h2>
      {
        transactions && transactions.length > 0 && transactions[0].id !== ''
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