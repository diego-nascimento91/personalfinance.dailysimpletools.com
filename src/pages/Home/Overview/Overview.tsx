import { useEffect, useState } from 'react';
import { ITransaction } from 'assets/interfaces/interfaces';
import { useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './Overview.module.scss';

const Overview = () => {
  const [user,] = useUser();
  const [transactions] = useTransactionsMonth();
  const [sumIncome, setSumIncome] = useState(0);
  const [sumExpense, setSumExpense] = useState(0);
  const [incomeWidth, setIncomeWidth] = useState('100%');
  const [expenseWidth, setExpenseWidth] = useState('100%');

  useEffect(() => {
    if (user) {
      handleGetSumsPerType();
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      handleChartStyle();
    }
  }, [sumIncome, sumExpense]);

  const handleChartStyle = () => {
    if(sumExpense > sumIncome){
      setExpenseWidth('100%');
      const calcWidth = (100*sumIncome/sumExpense).toString() + '%';
      setIncomeWidth(calcWidth);
    } else {
      setIncomeWidth('100%');
      const calcWidth = (100*sumExpense/sumIncome).toString() + '%';
      setExpenseWidth(calcWidth);
    }
  };

  const handleGetSumsPerType = () => {
    if (transactions && transactions.length > 0 && transactions[0].id !== '') {
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
      return +transaction.amount;
    }).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0
    );
  };

  return (
    <section className='theme__homesections'>
      <h2 className='theme__title'>Overview of income / expenses:</h2>
      <div>
        <div className={styles.overview__sum}>
          <div className={styles.overview__type}>Income:</div>
          <div className={styles.overview__chart__container}>
            <div
              className={styles.overview__chart}
              style={{ width: incomeWidth }}
            >
              <p className={styles.overview__price__positive}>+ R$ {sumIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className={styles.overview__sum}>
          <div className={styles.overview__type}>Expenses:</div>
          <div className={styles.overview__chart__container}>
            <div
              className={styles.overview__chart}
              style={{ width: expenseWidth }}
            >
              <p className={styles.overview__price__negative}>- R$ {sumExpense.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;