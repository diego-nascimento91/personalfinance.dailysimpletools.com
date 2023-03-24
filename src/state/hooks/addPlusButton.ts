import { useRecoilState } from 'recoil';
import { showPlusButtonState, showReceiptState } from 'state/addPlusButton';

export const useShowPlusButton = () => {
  return useRecoilState(showPlusButtonState);
};

export const useShowReceipt = () => {
  return useRecoilState(showReceiptState);
};