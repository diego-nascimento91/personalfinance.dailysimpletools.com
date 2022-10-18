import { atom } from 'recoil';
import { IAccounts, ICategory, ITransaction } from 'assets/interfaces/interfaces';

export const useChosenMonthAtom = atom<Date> ({
  key: 'useChosenMonthAtom',
  default: new Date()
});

export const useTransactionsMonthAtom = atom<ITransaction[]> ({
  key: 'useTransactionsMonthAtom',
  default: []
});

export const useTransactionsAllAtom = atom<ITransaction[]> ({
  key: 'useTransactionsAllAtom',
  default: []
});

export const useCategoriesAtom = atom<ICategory[]> ({
  key: 'useCategoriesAtom',
  default: []
});

export const useAccountsAtom = atom<IAccounts[]> ({
  key: 'useAccountsAtom',
  default: []
});