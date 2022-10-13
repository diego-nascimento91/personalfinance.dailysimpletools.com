import { atom } from 'recoil';
import db from 'components/MenuST/assets/languageDB.json';
import firebase from 'firebase/compat/app';
import { ICategory, ITransaction } from 'assets/interfaces/interfaces';

const languageDB = db.languages;
export const languagesAtom = atom<typeof languageDB> ({
  key: 'languagesAtom',
  default: languageDB
});

export const selectedLanguageAtom = atom<typeof languageDB[0]> ({
  key: 'selectedLanguageAtom',
  default: languageDB[0]
});

export const menuStatusAtom = atom<boolean> ({
  key: 'menuStatusAtom',
  default: false
});

export const isSignedInAtom = atom<boolean> ({
  key: 'isSignedInAtom',
  default: false
});

export const userAtom = atom<firebase.User | null> ({
  key: 'userAtom',
  default: null
});

export const userMenuStatusAtom = atom<boolean> ({
  key: 'userMenuStatusAtom',
  default: false
});

export const useTransactionsMonthAtom = atom<ITransaction[]> ({
  key: 'useTransactionsMonthAtom',
  default: []
});

export const useTransactionsAllAtom = atom<ITransaction[]> ({
  key: 'useTransactionsAllAtom',
  default: []
});

export const useCategoriesAtom = atom<ICategory[]> ({
  key: 'useCategoriesAtom',
  default: []
});