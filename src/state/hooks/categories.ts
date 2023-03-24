import { useRecoilState, useRecoilValue } from 'recoil';
import { categoriesState, userCategoriesState, selectedCategory_toBeEditedState } from '../categories';


export const useCategories = () => {
  return useRecoilState(categoriesState);
};

export const useUserCategories = () => {
  return useRecoilValue(userCategoriesState);
};

export const useSelectedCategory_toBeEdited = () => {
  return useRecoilState(selectedCategory_toBeEditedState);
};
