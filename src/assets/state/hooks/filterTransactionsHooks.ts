import { useRecoilState } from 'recoil';
import { useFilteredCategoryAtom, useFilteredTransactionTypeAtom } from '../filterTransactionsAtoms';

export const useFilteredCategory = () => {
  return useRecoilState(useFilteredCategoryAtom);
};

export const useFilteredTransactionType = () => {
  return useRecoilState(useFilteredTransactionTypeAtom);
};