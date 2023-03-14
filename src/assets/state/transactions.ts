import { ITotalsCategories, ITransaction, ITransactionType } from 'assets/interfaces/interfaces';
import { atom } from 'recoil';

export const useShowChooseTypeTransactionPopUpAtom = atom<boolean> ({
  key: 'useShowChooseTypeTransactionPopUpAtom',
  default: false
});

export const useShowReceiptPopUpAtom = atom<boolean> ({
  key: 'useShowReceiptPopUpAtom',
  default: false
});

export const useCurrentTransactionAtom = atom<ITransaction | null> ({
  key: 'useCurrentTransactionAtom',
  default: null
});

export const useFilteredCategoryAtom = atom<ITotalsCategories | null> ({
  key: 'useFilteredCategoryAtom',
  default: null
});

export const useFilteredTransactionTypeAtom = atom<ITransactionType> ({
  key: 'useFilteredTransactionTypeAtom',
  default: 'expense'
});

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

