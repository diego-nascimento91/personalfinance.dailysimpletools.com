import { IAccount } from 'assets/interfaces/interfaces';
import { compareStrings } from './compareStrings';

export const isAccountNameValid = (name: string, accounts: IAccount[], selectedAccount: IAccount | null) => {
  // if name is empty there is no error
  if (name === '') {
    return true;
  }

  // find if there is any name that is equal to the input name
  const nameExists = accounts.some(account => {
    // if user is editing a current category
    if(selectedAccount) {
      return compareStrings(account.name, name) && account.id !== selectedAccount.id;
    }
    return compareStrings(account.name, name);
  });

  if (nameExists) {
    return false;
  } else {
    return true;
  }
};