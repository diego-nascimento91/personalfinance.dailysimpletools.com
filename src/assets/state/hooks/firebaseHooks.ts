import { authenticated } from 'assets/functions/FirebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { useCategoriesAtom, useChosenMonthAtom, useTransactionsAllAtom, useTransactionsMonthAtom } from '../firebaseAtoms';

export const useUser = () => {
  return useAuthState(authenticated);
};

export const useCategories = () => {
  return useRecoilState(useCategoriesAtom);
};

export const useChosenMonth = () => {
  return useRecoilState(useChosenMonthAtom);
};

export const useTransactionsAll = () => {
  return useRecoilState(useTransactionsAllAtom);
};

export const useTransactionsMonth = () => {
  return useRecoilState(useTransactionsMonthAtom);
};