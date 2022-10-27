import { atom } from 'recoil';

export const useFilteredCategoryAtom = atom<string | null> ({
  key: 'useFilteredCategoryAtom',
  default: null
});
