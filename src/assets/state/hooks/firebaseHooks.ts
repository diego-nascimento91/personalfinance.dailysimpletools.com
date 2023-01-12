import { authenticated } from 'assets/functions/FirebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { useAccountsAtom, useCategoriesAtom, useChosenMonthAtom, useRecentTransactionsAtom, useSelectedAccountAtom, useTransactionsMonthAtom } from '../firebaseAtoms';

export const useUser = () => {
  return useAuthState(authenticated);
};

export const useCategories = () => {
  return useRecoilState(useCategoriesAtom);
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

export const useAccounts = () => {
  return useRecoilState(useAccountsAtom);
};

export const useSelectedAccount = () => {
  return useRecoilState(useSelectedAccountAtom);
};

