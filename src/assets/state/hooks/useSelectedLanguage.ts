import { useRecoilValue } from 'recoil';
import { selectedLanguageAtom } from '../atom';

export const useSelectedLanguage = () => {
  const selectedLanguage = useRecoilValue(selectedLanguageAtom);
  return selectedLanguage;
};