import { useRecoilState } from 'recoil';
import { useFilteredCategoryAtom } from '../filterTransactionsAtoms';

export const useFilteredCategory = () => {
  return useRecoilState(useFilteredCategoryAtom);
};