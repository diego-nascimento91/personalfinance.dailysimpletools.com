import { atom } from 'recoil';
import { IAccount } from 'utils/interfaces';


export const accountsState = atom<IAccount[]> ({
  key: 'accountsState',
  default: []
});

export const selectedAccount_toBeEditedState = atom<IAccount | null> ({
  key: 'selectedAccount_toBeEditedState',
  default: null
});