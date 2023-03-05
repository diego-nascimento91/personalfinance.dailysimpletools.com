import { useEffect, useState } from 'react';
import { useAccounts, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import { calcChartWidth } from './_assets/calcChartWidth';
import { getIncomeExpenseSums } from './_assets/getIncomeExpenseSums';
import { getBalancesSum } from './_assets/getBalancesSum';
import { handleFetchAccounts } from 'assets/functions/handleDatabaseFunctions';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import styles from './Overview.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import InfoProjectedBalance from './InfoProjectedBalance/InfoProjectedBalance';
import GraphBar from './GraphBar/GraphBar';

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
          <GraphBar title='Income:' total={sumIncome} width={incomeWidth}/>
          <GraphBar title='Expenses:' total={sumExpense} width={expenseWidth}/>
        </div>
        <div className={styles.overview__graphBarsBalance}>
          <GraphBar title='Current Balance:' total={sumCurrentBalance} width={currentBalanceWidth}/>
          <GraphBar info={<InfoProjectedBalance/>} title='Projected Balance: ' total={sumProjectedBalance} width={projectedBalanceWidth}/>
        </div>
      </div>
    </section>
  );
};

export default Overview;