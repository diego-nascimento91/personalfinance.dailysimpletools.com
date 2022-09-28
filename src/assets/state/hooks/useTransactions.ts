import { useRecoilState } from 'recoil';
import { useTransactionsAtom } from '../atom';

export const useTransactions = () => {
  return useRecoilState(useTransactionsAtom);
};