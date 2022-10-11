import { useRecoilState } from 'recoil';
import { useCategoriesAtom} from '../atom';

export const useCategories = () => {
  return useRecoilState(useCategoriesAtom);
};