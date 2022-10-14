import { ITransaction } from 'assets/interfaces/interfaces';
import { Link } from 'react-router-dom';
import styles from './TransactionsSummary.module.scss';
import TransactionSummary from './TransactionSummary/TransactionSummary';

interface Props {
  transactions: ITransaction[],
  allTransactions?: boolean
}
const TransactionsSummary = ({ transactions, allTransactions = false } : Props) => {

  return (
    <section className={`${styles.transactions__container} theme__homesections`}>
      {!allTransactions && <Link to="/transactions" className={styles.transactions__seeall}>see all</Link>}
      <h2 className={styles.transactions__title}>Recent Transactions</h2>
      {
        transactions && transactions.length > 0 && transactions[0].id !== ''
          ? (
            transactions.map((transaction, index) => {
              if (!allTransactions && index < 4) {
                return (
                  <TransactionSummary transaction={transaction} key={transaction.id} />
                );
              } else if(allTransactions) {
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

export default TransactionsSummary;