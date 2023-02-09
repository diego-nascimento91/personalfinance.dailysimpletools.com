import { ITransaction } from 'assets/interfaces/interfaces';

export const getIncomeExpenseSums = (transactions: ITransaction[]) => {
  let sumIncome;
  let sumExpenses;

  if (transactions && transactions.length > 0 && transactions[0].id !== '') {
    //income
    const totalIncome = transactions.filter(item => (item.type === 'income')).map(item => (item.amount)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    sumIncome = totalIncome;

    //expense
    const totalExpense = transactions.filter(item => (item.type === 'expense' && item.category !== 'Credit Card Bill')).map(item => (item.amount)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    sumExpenses = totalExpense;

  } else {
    sumIncome = 0;
    sumExpenses = 0;
  }

  return [sumIncome, sumExpenses];
};