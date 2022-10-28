import { ITotalsCategories } from 'assets/interfaces/interfaces';
import { atom } from 'recoil';

export const useFilteredCategoryAtom = atom<ITotalsCategories | null> ({
  key: 'useFilteredCategoryAtom',
  default: null
});
