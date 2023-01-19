import { useEffect, useState } from 'react';
import { useAccounts, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './Overview.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import classNames from 'classnames';

const Overview = () => {
  const [user,] = useUser();
  const [transactions] = useTransactionsMonth();
  const [accounts] = useAccounts();

  const [sumIncome, setSumIncome] = useState(0);
  const [sumExpense, setSumExpense] = useState(0);
  const [incomeWidth, setIncomeWidth] = useState('100%');
  const [expenseWidth, setExpenseWidth] = useState('100%');

  const [sumCurrentBalance, setSumCurrentBalance] = useState(0);
  const [sumProjectedBalance, setSumProjectedBalance] = useState(0);
  const [currentBalanceWidth, setCurrentBalanceWidth] = useState('100%');
  const [projectedBalanceWidth, setProjectedBalanceWidth] = useState('100%');

  useEffect(() => {
    if (user) {
      handleGetSumsPerType();
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      handleChartStyle();
    }
  }, [sumIncome, sumExpense, sumCurrentBalance, sumProjectedBalance]);

  const handleChartStyle = () => {
    // incomes/ expenses
    if (sumExpense > sumIncome) {
      setExpenseWidth('100%');
      const calcWidth = (100 * sumIncome / sumExpense).toString() + '%';
      setIncomeWidth(calcWidth);
    } else {
      setIncomeWidth('100%');
      const calcWidth = (100 * sumExpense / sumIncome).toString() + '%';
      setExpenseWidth(calcWidth);
    }

    // Current/ Projected Balances
    if (Math.abs(sumCurrentBalance) > Math.abs(sumProjectedBalance)) {
      setCurrentBalanceWidth('100%');
      const calcWidth = (100 * Math.abs(sumProjectedBalance / sumCurrentBalance)).toString() + '%';
      setProjectedBalanceWidth(calcWidth);
    } else {
      setProjectedBalanceWidth('100%');
      const calcWidth = (100 * Math.abs(sumCurrentBalance / sumProjectedBalance)).toString() + '%';
      setCurrentBalanceWidth(calcWidth);
    }
  };

  const handleGetSumsPerType = () => {
    if (transactions && transactions.length > 0 && transactions[0].id !== '') {
      //income
      const totalIncome = transactions.filter(item => (item.type === 'income')).map(item => (item.amount)).reduce(
        (previousValue, currentValue) => previousValue + currentValue, 0);
      setSumIncome(totalIncome);

      //expense
      const totalExpense = transactions.filter(item => (item.type === 'expense')).map(item => (item.amount)).reduce(
        (previousValue, currentValue) => previousValue + currentValue, 0);
      setSumExpense(totalExpense);

      //balance account
      const totalBalanceAccount = accounts.filter(item => (item.type === 'balance-account')).map(item => (item.balance)).reduce(
        (previousValue, currentValue) => previousValue + currentValue, 0);
      setSumCurrentBalance(totalBalanceAccount);

      //credit account
      const totalCreditAccount = transactions.filter(item => (item.account.type === 'credit-account')).map(item => (item.amount)).reduce(
        (previousValue, currentValue) => previousValue + currentValue, 0);
      setSumProjectedBalance(totalBalanceAccount - totalCreditAccount);

    } else {
      setSumIncome(0);
      setSumExpense(0);
      setSumCurrentBalance(0);
      setSumProjectedBalance(0);
    }
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
            <div className={styles.overview__type}>Projected Balance:</div>
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