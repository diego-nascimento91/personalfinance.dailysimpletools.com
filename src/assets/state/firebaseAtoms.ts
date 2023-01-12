import { atom } from 'recoil';
import { IAccount, ICategory, ITransaction } from 'assets/interfaces/interfaces';

export const useChosenMonthAtom = atom<Date> ({
  key: 'useChosenMonthAtom',
  default: new Date()
});

export const useTransactionsMonthAtom = atom<ITransaction[]> ({
  key: 'useTransactionsMonthAtom',
  default: []
});

export const useRecentTransactionsAtom = atom<ITransaction[]> ({
  key: 'useRecentTransactionsAtom',
  default: []
});

export const useCategoriesAtom = atom<ICategory[]> ({
  key: 'useCategoriesAtom',
  default: []
});

export const useAccountsAtom = atom<IAccount[]> ({
  key: 'useAccountsAtom',
  default: []
});

export const useSelectedAccountAtom = atom<IAccount | null> ({
  key: 'useSelectedAccountAtom',
  default: null
});