import { atom, selector } from 'recoil';
import { ICategory } from 'utils/interfaces';

export const categoriesState = atom<ICategory[]> ({
  key: 'categoriesState',
  default: []
});

export const userCategoriesState = selector<ICategory[]> ({
  key: 'userCategoriesState',
  get: ({ get }) => {
    const categories = get(categoriesState);

    return categories.filter(category => category.db === 'user');
  }
});

export const selectedCategory_toBeEditedState = atom<ICategory | null> ({
  key: 'selectedCategory_toBeEditedState',
  default: null
});

