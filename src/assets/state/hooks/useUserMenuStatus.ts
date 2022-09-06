import { useRecoilState } from 'recoil';
import { userMenuStatusAtom } from '../atom';

export const useUserMenuStatus = () => {
  return useRecoilState(userMenuStatusAtom);
};