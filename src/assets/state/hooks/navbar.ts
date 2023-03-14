import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { menuStatusAtom, languagesAtom, selectedLanguageAtom, userMenuStatusAtom } from '../navbar';

export const useMenuStatus = () => {
  return useRecoilState(menuStatusAtom);
};

export const useLanguages = () => {
  const languages = useRecoilValue(languagesAtom);
  return languages;
};

export const useSelectedLanguage = () => {
  const selectedLanguage = useRecoilValue(selectedLanguageAtom);
  return selectedLanguage;
};

export const useSetSelectedLanguage = () => {
  const setSelectedLanguage = useSetRecoilState(selectedLanguageAtom);
  return setSelectedLanguage;
};

export const useUserMenuStatus = () => {
  return useRecoilState(userMenuStatusAtom);
};