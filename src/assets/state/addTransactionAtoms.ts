import { ITransaction } from 'assets/interfaces/interfaces';
import { atom } from 'recoil';

export const useShowChooseTypeTransactionPopUpAtom = atom<boolean> ({
  key: 'useShowChooseTypeTransactionPopUpAtom',
  default: false
});

export const useShowAddFormPopUpAtom = atom<boolean> ({
  key: 'useShowAddFormPopUpAtom',
  default: false
});

export const useChosenTypeAtom = atom<'expense' | 'income'> ({
  key: 'useChosenTypeAtom',
  default: 'expense'
});

export const useShowReceiptPopUpAtom = atom<boolean> ({
  key: 'useShowReceiptPopUpAtom',
  default: false
});

export const useCurrentTransactionAtom = atom<ITransaction | null> ({
  key: 'useCurrentTransactionAtom',
  default: null
});

