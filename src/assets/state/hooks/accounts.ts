import { useRecoilState } from 'recoil';
import { useAccountsAtom, useSelectedAccountAtom } from '../accounts';


export const useAccounts = () => {
  return useRecoilState(useAccountsAtom);
};

export const useSelectedAccount = () => {
  return useRecoilState(useSelectedAccountAtom);
};