import { Link } from 'react-router-dom';
import { ITransaction } from 'assets/interfaces/interfaces';
import { useFilteredCategory } from 'assets/state/hooks/filterTransactionsHooks';
import styles from './TransactionsSummary.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import TransactionSummary from './TransactionSummary/TransactionSummary';

interface Props {
  transactions: ITransaction[],
  allTransactions?: boolean
}
const TransactionsSummary = (props: Props) => {
  const { transactions, allTransactions = false } = props;

  const [filteredCategory] = useFilteredCategory();

  return (
    <section className={`${styles.transactions__container} ${stylesComponents.pageComponents}`}>
      {!allTransactions && <Link to="/transactions" className={styles.transactions__seeall}>see all</Link>}
      <h2 className={`theme__title ${styles.transactions__title}`}>{allTransactions ? 'Transactions' : 'Recent Transactions'}</h2>
      {
        transactions && transactions.length > 0
          ? (
            transactions.map((transaction, index) => {
              if (!allTransactions) {
                if (index < 4)
                  return (<TransactionSummary transaction={transaction} key={transaction.id} />);
              }
              else {
                if (!filteredCategory)
                  return (<TransactionSummary transaction={transaction} key={transaction.id} />);
                else if (filteredCategory && filteredCategory.name === transaction.category)
                  return (<TransactionSummary transaction={transaction} key={transaction.id} />);
              }
            })
          )
          : <p>No transactions added yet</p>
      }
    </section>
  );
};

export default TransactionsSummary;