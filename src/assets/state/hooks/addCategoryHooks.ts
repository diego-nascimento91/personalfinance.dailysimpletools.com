import { useRecoilState } from 'recoil';
import { useSelectedCategoryAtom, useUserCategoriesAtom } from '../addCategoryAtoms';

export const useUserCategories = () => {
  return useRecoilState(useUserCategoriesAtom);
};

export const useSelectedCategory = () => {
  return useRecoilState(useSelectedCategoryAtom);
};