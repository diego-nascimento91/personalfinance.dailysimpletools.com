import { IAccount, ITransaction } from 'assets/interfaces/interfaces';
import { SetterOrUpdater } from 'recoil';

export const setBalancesSums = (accounts: IAccount[], transactions: ITransaction[],setSumCurrentBalance: SetterOrUpdater<number>, setSumProjectedBalance: SetterOrUpdater<number>) => {

  if (accounts && accounts.length > 0 && accounts[0].id !== '') {
    //balance account
    const totalBalanceAccount = accounts.filter(item => (item.type === 'balance-account')).map(item => (item.balance)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    setSumCurrentBalance(totalBalanceAccount);

    //credit account
    const totalCreditAccount = transactions.filter(item => (item.account.type === 'credit-account')).map(item => (item.amount)).reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0);
    setSumProjectedBalance(totalBalanceAccount - totalCreditAccount);

  } else {
    setSumCurrentBalance(0);
    setSumProjectedBalance(0);
  }
};