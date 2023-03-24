import { ITotalsCategories, ITransaction, ITransactionType } from 'utils/interfaces';
import { atom, selector } from 'recoil';
import categoriesUtils from './utils/categories';


export const transactionsState = atom<ITransaction[]>({
  key: 'transactionsState',
  default: []
});

export const selectedTransaction_toBeEditedState = atom<ITransaction | null>({
  key: 'selectedTransaction_toBeEditedState',
  default: null
});

export const transactionsFilter_byCategoryState = atom<ITotalsCategories | null>({
  key: 'transactionsFilter_byCategory',
  default: null
});

export const transactionsFilter_byMonthState = atom<Date>({
  key: 'transactionsFilter_byMonthState',
  default: new Date()
});

export const transactionsFilter_byTypeState = atom<ITransactionType>({
  key: 'transactionsFilter_byTypeState',
  default: 'expense'
});

export const transactionsTotalsPerCategoryState = selector({
  key: 'transactionsTotalsPerCategoryState',
  get: ({ get }) => {
    const transactions = get(transactionsState);
    const typeTransaction = get(transactionsFilter_byTypeState);

    return categoriesUtils.getTransactionsTotalsPerCategory(transactions, typeTransaction);
  }
});





