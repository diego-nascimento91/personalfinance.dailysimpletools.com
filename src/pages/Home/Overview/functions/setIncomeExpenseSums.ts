import { ITransaction } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';

export const setIncomeExpenseSums = (transactions: ITransaction[], setSumIncome: SetterOrUpdater<number>, setSumExpense: SetterOrUpdater<number>) => {
  if (transactions && transactions.length > 0 && transactions[0].id !== '') {
    //income
    const totalIncome = transactions.filter(item => (item.type === 'income')).map(item => (item.amount)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    setSumIncome(totalIncome);

    //expense
    const totalExpense = transactions.filter(item => (item.type === 'expense' && item.category !== 'Credit Card Bill')).map(item => (item.amount)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    setSumExpense(totalExpense);

  } else {
    setSumIncome(0);
    setSumExpense(0);
  }
};