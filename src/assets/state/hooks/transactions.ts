import { useRecoilState, useRecoilValue } from 'recoil';
import { useChosenMonthAtom, useCurrentTransactionAtom, useFilteredCategoryAtom, useFilteredTransactionTypeAtom, useRecentTransactionsAtom, useShowChooseTypeTransactionPopUpAtom, useShowReceiptPopUpAtom, transactionsState, transactionsTotalsPerCategoryState } from '../transactions';


export const useShowChooseTypeTransactionPopUp = () => {
  return useRecoilState(useShowChooseTypeTransactionPopUpAtom);
};

export const useShowReceiptPopUp = () => {
  return useRecoilState(useShowReceiptPopUpAtom);
};

export const useCurrentTransaction = () => {
  return useRecoilState(useCurrentTransactionAtom);
};

export const useChosenMonth = () => {
  return useRecoilState(useChosenMonthAtom);
};

export const useRecentTransactions = () => {
  return useRecoilState(useRecentTransactionsAtom);
};

export const useFilteredCategory = () => {
  return useRecoilState(useFilteredCategoryAtom);
};

export const useFilteredTransactionType = () => {
  return useRecoilState(useFilteredTransactionTypeAtom);
};



export const useTransactionsMonth = () => {
  return useRecoilState(transactionsState);
};

export const useTransactionsTotalsPerCategory = () => {
  return useRecoilValue(transactionsTotalsPerCategoryState);
};