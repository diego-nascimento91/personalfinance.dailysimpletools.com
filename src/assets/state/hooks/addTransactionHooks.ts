import { useRecoilState } from 'recoil';
import { useShowAddFormPopUpAtom, useShowChooseTypeTransactionPopUpAtom, useChosenTypeAtom, useShowReceiptPopUpAtom, useCurrentTransactionAtom } from '../addTransactionAtoms';


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

export const useCurrentTransaction = () => {
  return useRecoilState(useCurrentTransactionAtom);
};