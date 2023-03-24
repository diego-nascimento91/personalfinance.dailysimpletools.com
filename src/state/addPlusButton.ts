import { atom } from 'recoil';

export const showPlusButtonState = atom<boolean>({
  key: 'showPlusButtonState',
  default: false
});

export const showReceiptState = atom<boolean>({
  key: 'showReceiptState',
  default: false
});