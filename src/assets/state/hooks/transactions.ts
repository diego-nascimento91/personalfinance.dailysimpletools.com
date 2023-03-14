import { useRecoilState } from 'recoil';
import { useChosenMonthAtom, useCurrentTransactionAtom, useFilteredCategoryAtom, useFilteredTransactionTypeAtom, useRecentTransactionsAtom, useShowChooseTypeTransactionPopUpAtom, useShowReceiptPopUpAtom, useTransactionsMonthAtom } from '../transactions';


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

export const useTransactionsMonth = () => {
  return useRecoilState(useTransactionsMonthAtom);
};

export const useFilteredCategory = () => {
  return useRecoilState(useFilteredCategoryAtom);
};

export const useFilteredTransactionType = () => {
  return useRecoilState(useFilteredTransactionTypeAtom);
};