import { useRecoilState } from 'recoil';
import { accountsState, selectedAccount_toBeEditedState } from 'state/accounts';


export const useAccounts = () => {
  return useRecoilState(accountsState);
};

export const useSelectedAccount_toBeEdited = () => {
  return useRecoilState(selectedAccount_toBeEditedState);
};