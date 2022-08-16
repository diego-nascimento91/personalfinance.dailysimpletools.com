import { useRecoilValue } from 'recoil';
import { languagesAtom } from '../atom';

export const useLanguages = () => {
  const languages = useRecoilValue(languagesAtom);
  return languages;
};