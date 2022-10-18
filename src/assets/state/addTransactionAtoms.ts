import { atom } from 'recoil';

export const useShowPopUpAtom = atom<boolean> ({
  key: 'useShowPopUpAtom',
  default: false
});

export const useShowAddFormAtom = atom<boolean> ({
  key: 'useShowAddFormAtom',
  default: false
});

export const useChosenTypeAtom = atom<'expense' | 'income'> ({
  key: 'useChosenTypeAtom',
  default: 'expense'
});
