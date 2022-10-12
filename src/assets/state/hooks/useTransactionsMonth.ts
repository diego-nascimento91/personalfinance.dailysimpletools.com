import { useRecoilState } from 'recoil';
import { useTransactionsMonthAtom } from '../atom';

export const useTransactionsMonth = () => {
  return useRecoilState(useTransactionsMonthAtom);
};