import { useRecoilState } from 'recoil';
import { useChosenMonthAtom} from '../atom';

export const useChosenMonth = () => {
  return useRecoilState(useChosenMonthAtom);
};