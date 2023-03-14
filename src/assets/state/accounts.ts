import { atom } from 'recoil';
import { IAccount } from 'assets/interfaces/interfaces';


export const useAccountsAtom = atom<IAccount[]> ({
  key: 'useAccountsAtom',
  default: []
});

export const useSelectedAccountAtom = atom<IAccount | null> ({
  key: 'useSelectedAccountAtom',
  default: null
});