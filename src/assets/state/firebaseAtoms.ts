import { atom } from 'recoil';
import firebase from 'firebase/compat/app';
import { ICategory, ITransaction } from 'assets/interfaces/interfaces';

export const userAtom = atom<firebase.User | null> ({
  key: 'userAtom',
  default: null
});

export const useTransactionsMonthAtom = atom<ITransaction[]> ({
  key: 'useTransactionsMonthAtom',
  default: []
});

export const useTransactionsAllAtom = atom<ITransaction[]> ({
  key: 'useTransactionsAllAtom',
  default: []
});

export const useChosenMonthAtom = atom<Date> ({
  key: 'useChosenMonthAtom',
  default: new Date()
});

export const useCategoriesAtom = atom<ICategory[]> ({
  key: 'useCategoriesAtom',
  default: []
});