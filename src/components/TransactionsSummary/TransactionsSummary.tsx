import { Link } from 'react-router-dom';
import { ITransaction } from 'assets/interfaces/interfaces';
import { useEffect, useState } from 'react';
import styles from './TransactionsSummary.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import TransactionSummary from './TransactionSummary/TransactionSummary';
import { useFilteredCategory, useFilteredTransactionType } from 'assets/state/hooks/transactions';

interface Props {
  transactions: ITransaction[],
  allTransactions?: boolean
}
const TransactionsSummary = (props: Props) => {
  const {transactions, allTransactions = false} = props;
  const [filteredCategory] = useFilteredCategory();
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>();
  const [filteredTransactionType] = useFilteredTransactionType();

  useEffect(() => {
    filterTransactions();
  }, [filteredCategory, filteredTransactionType, transactions]);

  const filterTransactions = () => {
    let thisFilteredTransactions: ITransaction[] = [];

    if(!allTransactions) {
      thisFilteredTransactions = transactions.slice(0, 4);
    } 
    else {
      if (filteredCategory) {
        thisFilteredTransactions = transactions.filter(item => (
          item.category?.name === filteredCategory.name 
            && item.type === filteredTransactionType
            
        ));
      } else {
        thisFilteredTransactions = transactions;
      }
    }
    
    setFilteredTransactions(thisFilteredTransactions);
  };

  return (
    <section className={`${styles.transactions__container} ${stylesComponents.pageComponents}`}>
      {!allTransactions && <Link to="/transactions" className={styles.transactions__seeall}>see all</Link>}
      <h2 className={`theme__title ${styles.transactions__title}`}>{allTransactions ? 'Transactions' : 'Recent Transactions'}</h2>
      {
        filteredTransactions && filteredTransactions.length > 0 
          ? (
            filteredTransactions.map(item => (
              <TransactionSummary transaction={item} key={item.id} />
            ))
          )
          : <p>No transactions added yet</p>
      }
    </section>
  );
};

export default TransactionsSummary;