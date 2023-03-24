import { useRecoilState } from 'recoil';
import { lastAddedTransactionsState } from '../lastAddedTransactions';

export const useLastAddedTransactions = () => {
  return useRecoilState(lastAddedTransactionsState);
};