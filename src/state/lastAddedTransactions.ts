import { ITransaction } from 'utils/interfaces';
import { atom } from 'recoil';

export const lastAddedTransactionsState = atom<ITransaction[]>({
  key: 'lastAddedTransactionsState',
  default: []
});