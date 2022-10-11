import { ITransaction } from 'assets/interfaces/interfaces';
import { useTransactions } from 'assets/state/hooks/useTransactions';
import { useEffect, useState } from 'react';
import styles from './Overview.module.scss';

const Overview = () => {
  const [transactions] = useTransactions();
  const [sumIncome, setSumIncome] = useState(0);
  const [sumExpense, setSumExpense] = useState(0);

  useEffect(() => {
    if(transactions && transactions.length > 0){
      setSumIncome(getSumPerType('income', transactions as ITransaction[]));
      setSumExpense(getSumPerType('expense', transactions as ITransaction[]));
    } else {
      setSumIncome(0);
      setSumExpense(0);
    }
  }, [transactions]);

  const getSumPerType = (type: string, transactionsArray: ITransaction[]) => {
    const priceArray = transactionsArray.filter(transaction => {
      return transaction.type === type;
    }).map(transaction => {
      return +transaction.price;
    });
    return priceArray.reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0
    );
  };

  return (
    <section className='theme__homesections'>
      <h2 className='theme__title'>Overview of income / expenses:</h2>
      <div>
        <div className={styles.overview__sum}>
          <p>Income:</p>
          <p className={styles.overview__price__positive}>+ R$ {sumIncome.toFixed(2)}</p>
        </div>
        <div className={styles.overview__sum}>
          <p>Expenses:</p>
          <p className={styles.overview__price__negative}>- R$ {sumExpense.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
};

export default Overview;