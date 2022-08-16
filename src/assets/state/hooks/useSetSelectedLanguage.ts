import { useSetRecoilState } from 'recoil';
import { selectedLanguageAtom } from '../atom';

export const useSetSelectedLanguage = () => {
  const setSelectedLanguage = useSetRecoilState(selectedLanguageAtom);
  return setSelectedLanguage;
};