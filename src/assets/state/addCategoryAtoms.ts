import { atom } from 'recoil';
import { ICategory } from 'assets/interfaces/interfaces';

export const useUserCategoriesAtom = atom<ICategory[]> ({
  key: 'useUserCategoriesAtom',
  default: []
});

export const useSelectedCategoryAtom = atom<ICategory | null> ({
  key: 'useSelectedCategoryAtom',
  default: null
});