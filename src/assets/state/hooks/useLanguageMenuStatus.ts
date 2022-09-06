import { useRecoilState } from 'recoil';
import { menuStatusAtom } from '../atom';

export const useMenuStatus = () => {
  return useRecoilState(menuStatusAtom);
};