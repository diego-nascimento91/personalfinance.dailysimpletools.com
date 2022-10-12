import { ITransaction } from 'assets/interfaces/interfaces';
import { useTransactionsMonth } from 'assets/state/hooks/useTransactionsMonth';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import styles from './Overview.module.scss';

const Overview = () => {
  const [user,] = useUser();
  const [transactions] = useTransactionsMonth();
  const [sumIncome, setSumIncome] = useState(0);
  const [sumExpense, setSumExpense] = useState(0);

  useEffect(() => {
    if(user) {
      handleGetSumsPerType();
    }
  }, [transactions, user]);

  const handleGetSumsPerType = () => {
    if(transactions && transactions.length > 0 && transactions[0].id !== ''){
      setSumIncome(getSumPerType('income', transactions));
      setSumExpense(getSumPerType('expense', transactions));
    } else {
      setSumIncome(0);
      setSumExpense(0);
    }
  };

  const getSumPerType = (type: string, transactionsArray: ITransaction[]) => {
    return transactionsArray.filter(transaction => {
      return transaction.type === type;
    }).map(transaction => {
      return +transaction.price;
    }).reduce(
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