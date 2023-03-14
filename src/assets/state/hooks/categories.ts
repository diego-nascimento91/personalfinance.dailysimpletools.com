import { useRecoilState } from 'recoil';
import { useCategoriesAtom, useSelectedCategoryAtom, useUserCategoriesAtom } from '../categories';

export const useUserCategories = () => {
  return useRecoilState(useUserCategoriesAtom);
};

export const useSelectedCategory = () => {
  return useRecoilState(useSelectedCategoryAtom);
};

export const useCategories = () => {
  return useRecoilState(useCategoriesAtom);
};