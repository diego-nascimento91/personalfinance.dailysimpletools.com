import { ITotalsCategories, ITransaction, ITransactionType } from 'assets/interfaces/interfaces';
import { atom, selector } from 'recoil';
import categoriesUtils from './utils/categories';

export const useShowChooseTypeTransactionPopUpAtom = atom<boolean>({
  key: 'useShowChooseTypeTransactionPopUpAtom',
  default: false
});

export const useShowReceiptPopUpAtom = atom<boolean>({
  key: 'useShowReceiptPopUpAtom',
  default: false
});

export const useCurrentTransactionAtom = atom<ITransaction | null>({
  key: 'useCurrentTransactionAtom',
  default: null
});

export const useFilteredCategoryAtom = atom<ITotalsCategories | null>({
  key: 'useFilteredCategoryAtom',
  default: null
});



export const useChosenMonthAtom = atom<Date>({
  key: 'useChosenMonthAtom',
  default: new Date()
});

export const useRecentTransactionsAtom = atom<ITransaction[]>({
  key: 'useRecentTransactionsAtom',
  default: []
});



export const transactionsState = atom<ITransaction[]>({
  key: 'transactionsState',
  default: []
});

export const useFilteredTransactionTypeAtom = atom<ITransactionType>({
  key: 'useFilteredTransactionTypeAtom',
  default: 'expense'
});

export const transactionsTotalsPerCategoryState = selector({
  key: 'transactionsTotalsPerCategoryState',
  get: ({ get }) => {
    const transactions = get(transactionsState);
    const typeTransaction = get(useFilteredTransactionTypeAtom);

    return categoriesUtils.getTransactionsTotalsPerCategory(transactions, typeTransaction);
  }
});




