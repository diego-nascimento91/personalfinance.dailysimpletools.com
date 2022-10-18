import { useRecoilState } from 'recoil';
import { useShowAddFormPopUpAtom, useShowChooseTypeTransactionPopUpAtom, useChosenTypeAtom, useShowReceiptPopUpAtom, useCurrentReceiptAtom } from '../addTransactionAtoms';


export const useShowChooseTypeTransactionPopUp = () => {
  return useRecoilState(useShowChooseTypeTransactionPopUpAtom);
};

export const useShowAddFormPopUp = () => {
  return useRecoilState(useShowAddFormPopUpAtom);
};

export const useChosenType = () => {
  return useRecoilState(useChosenTypeAtom);
};

export const useShowReceiptPopUp = () => {
  return useRecoilState(useShowReceiptPopUpAtom);
};

export const useCurrentReceipt = () => {
  return useRecoilState(useCurrentReceiptAtom);
};