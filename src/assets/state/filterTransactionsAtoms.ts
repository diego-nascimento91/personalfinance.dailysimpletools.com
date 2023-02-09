import { ITotalsCategories, ITransactionType } from 'assets/interfaces/interfaces';
import { atom } from 'recoil';

export const useFilteredCategoryAtom = atom<ITotalsCategories | null> ({
  key: 'useFilteredCategoryAtom',
  default: null
});

export const useFilteredTransactionTypeAtom = atom<ITransactionType> ({
  key: 'useFilteredTransactionTypeAtom',
  default: 'expense'
});
