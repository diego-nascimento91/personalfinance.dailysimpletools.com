import { useRecoilState } from 'recoil';
import { useShowChooseTypeTransactionPopUpAtom, useShowReceiptPopUpAtom, useCurrentTransactionAtom } from '../addTransactionAtoms';


export const useShowChooseTypeTransactionPopUp = () => {
  return useRecoilState(useShowChooseTypeTransactionPopUpAtom);
};

export const useShowReceiptPopUp = () => {
  return useRecoilState(useShowReceiptPopUpAtom);
};

export const useCurrentTransaction = () => {
  return useRecoilState(useCurrentTransactionAtom);
};