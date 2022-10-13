import { ITransaction } from 'assets/interfaces/interfaces';
import { Link } from 'react-router-dom';
import styles from './RecentTransactions.module.scss';
import TransactionSummary from './TransactionSummary/TransactionSummary';

const RecentTransactions = ({ transactions }:{ transactions?: ITransaction[] }) => {

  return (
    <section className={`${styles.transactions__container} theme__homesections`}>
      <Link to="/transactions" className={styles.transactions__seeall}>see all</Link>
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