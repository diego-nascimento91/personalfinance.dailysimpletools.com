import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedTransaction_toBeEditedState, transactionsFilter_byCategoryState, transactionsFilter_byMonthState, transactionsFilter_byTypeState, transactionsState, transactionsTotalsPerCategoryState } from '../transactions';

export const useTransactions = () => {
  return useRecoilState(transactionsState);
};

export const useSelectedTransaction_toBeEdited = () => {
  return useRecoilState(selectedTransaction_toBeEditedState);
};

export const useTransactionsFilter_byCategory = () => {
  return useRecoilState(transactionsFilter_byCategoryState);
};

export const useTransactionsFilter_byMonth = () => {
  return useRecoilState(transactionsFilter_byMonthState);
};

export const useTransactionsFilter_byType = () => {
  return useRecoilState(transactionsFilter_byTypeState);
};

export const useTransactionsTotalsPerCategory = () => {
  return useRecoilValue(transactionsTotalsPerCategoryState);
};