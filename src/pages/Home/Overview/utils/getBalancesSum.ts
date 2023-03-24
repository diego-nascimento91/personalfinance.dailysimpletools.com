import { IAccount, ITransaction } from 'utils/interfaces';

export const getBalancesSum = (accounts: IAccount[], transactions: ITransaction[]) => {
  let currentBalanceSum;
  let projectedBalanceSum;

  if (accounts && accounts.length > 0 && accounts[0].id !== '') {
    //balance account
    const totalBalanceAccount = accounts.filter(item => (item.type === 'balance-account')).map(item => (item.balance)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    currentBalanceSum = totalBalanceAccount;

    //credit account
    const totalCreditAccount = transactions.filter(item => (item.account.type === 'credit-account')).map(item => (item.amount)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    projectedBalanceSum = totalBalanceAccount + totalCreditAccount;

  } else {
    currentBalanceSum = 0;
    projectedBalanceSum = 0;
  }

  return [currentBalanceSum, projectedBalanceSum];
};