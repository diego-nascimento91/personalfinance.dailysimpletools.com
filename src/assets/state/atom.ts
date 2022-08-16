import { atom } from 'recoil';
import db from 'components/MenuST/assets/languageDB.json';

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