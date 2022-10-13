import { useRecoilState } from 'recoil';
import { useTransactionsAllAtom } from '../atom';

export const useTransactionsAll = () => {
  return useRecoilState(useTransactionsAllAtom);
};