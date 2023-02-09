import { useEffect, useState } from 'react';
import { useAccounts, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import { calcChartWidth } from './functions/calcChartWidth';
import { getIncomeExpenseSums } from './functions/getIncomeExpenseSums';
import { getBalancesSum } from './functions/getBalancesSum';
import { handleFetchAccounts } from 'assets/functions/handleDatabaseFunctions';
import classNames from 'classnames';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import styles from './Overview.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import InfoProjectedBalance from './InfoProjectedBalance/InfoProjectedBalance';

const Overview = () => {
  const [user,] = useUser();
  const [transactions] = useTransactionsMonth();
  const [accounts, setAccounts] = useAccounts();

  const [sumIncome, setSumIncome] = useState(0);
  const [sumExpense, setSumExpense] = useState(0);
  const [incomeWidth, setIncomeWidth] = useState('100%');
  const [expenseWidth, setExpenseWidth] = useState('100%');

  const [sumCurrentBalance, setSumCurrentBalance] = useState(0);
  const [sumProjectedBalance, setSumProjectedBalance] = useState(0);
  const [currentBalanceWidth, setCurrentBalanceWidth] = useState('100%');
  const [projectedBalanceWidth, setProjectedBalanceWidth] = useState('100%');

  useEffect(() => {
    // calling firebase listener of the accounts with balance-account type.
    if (user)
      if (accounts && accounts.length > 0) {
        accounts.map(item => {
          FirebaseFirestoreService.docListener(`users/${user?.uid}/accounts`, item?.id as string, () => handleFetchAccounts(setAccounts, user.uid));
        });
      }
  }, []);

  useEffect(() => {
    if (user) {
      console.log('***useEffect***');
      handleChartConfig();
    }
  }, [accounts, transactions, user]);

  const handleChartConfig = () => {
    // Getting bar totals for the charts
    const [incomeTotal, expenseTotal] = getIncomeExpenseSums(transactions);
    setSumIncome(incomeTotal);
    setSumExpense(expenseTotal);

    const [currentBalanceTotal, projectedBalanceTotal] = getBalancesSum(accounts, transactions);
    setSumCurrentBalance(currentBalanceTotal);
    setSumProjectedBalance(projectedBalanceTotal);


    // Getting bar widths
    const [incomeWidthCalc, expenseWidthCalc] = calcChartWidth(incomeTotal, expenseTotal);
    setIncomeWidth(incomeWidthCalc);
    setExpenseWidth(expenseWidthCalc);

    const [currentBalanceWidthCalc, projectedBalanceWidthCalc] = calcChartWidth(currentBalanceTotal, projectedBalanceTotal);
    setCurrentBalanceWidth(currentBalanceWidthCalc);
    setProjectedBalanceWidth(projectedBalanceWidthCalc);
  };

  return (
    <section className={`${stylesComponents.pageComponents}`}>
      <h2 className='theme__title'>Overview</h2>
      <div className={styles.overview__graphBars__container}>

        <div className={styles.overview__graphBarsIncomeExpense}>
          <div className={styles.overview__graphBar}>
            <div className={styles.overview__type}>Income:</div>
            <div className={styles.overview__chart__container}>
              <div
                className={styles.overview__chart}
                style={{ width: incomeWidth }}
              >
                <p className={styles.overview__price__positive}>+ $ {sumIncome.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className={styles.overview__graphBar}>
            <div className={styles.overview__type}>Expenses:</div>
            <div className={styles.overview__chart__container}>
              <div
                className={styles.overview__chart}
                style={{ width: expenseWidth }}
              >
                <p className={styles.overview__price__negative}>- $ {sumExpense.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.overview__graphBarsBalance}>
          <div className={styles.overview__graphBar}>
            <div className={styles.overview__type}>Current Balance:</div>
            <div className={styles.overview__chart__container}>
              <div
                className={styles.overview__chart}
                style={{ width: currentBalanceWidth }}
              >
                <p className={
                  classNames({
                    [styles.overview__price__positive]: sumCurrentBalance >= 0,
                    [styles.overview__price__negative]: sumCurrentBalance < 0
                  })}>
                  {sumCurrentBalance >= 0 ? '+' : '-'} $ {Math.abs(sumCurrentBalance).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.overview__graphBar}>
            <div className={styles.overview__type}>Projected Balance: <InfoProjectedBalance/></div>
            <div className={styles.overview__chart__container}>
              <div
                className={styles.overview__chart}
                style={{ width: projectedBalanceWidth }}
              >
                <p className={
                  classNames({
                    [styles.overview__price__positive]: sumProjectedBalance >= 0,
                    [styles.overview__price__negative]: sumProjectedBalance < 0
                  })}>
                  {sumProjectedBalance >= 0 ? '+' : '-'} $ {Math.abs(sumProjectedBalance).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Overview;