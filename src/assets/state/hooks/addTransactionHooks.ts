import { useRecoilState } from 'recoil';
import { useShowAddFormAtom, useShowPopUpAtom, useChosenTypeAtom } from '../addTransactionAtoms';


export const useShowPopUp = () => {
  return useRecoilState(useShowPopUpAtom);
};

export const useShowAddForm = () => {
  return useRecoilState(useShowAddFormAtom);
};

export const useChosenType = () => {
  return useRecoilState(useChosenTypeAtom);
};