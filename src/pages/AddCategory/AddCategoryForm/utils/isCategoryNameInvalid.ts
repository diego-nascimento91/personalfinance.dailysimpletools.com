import { ICategory } from 'utils/interfaces';
import { compareStrings } from './compareStrings';

export const isCategoryNameInvalid = (name: string, type: string, categories: ICategory[], selectedCategory: ICategory | null) => {
  // if name or type is empty there is no error
  if (name === '' || type === '') {
    return false;
  }

  // get all categories of the type chosen by user
  const categoriesOfType = categories.filter(category => {
    return category.type === type;
  });

  // find if there is any name that is equal to the input name
  const nameExists = categoriesOfType.some(category => {
    // if user is editing a current category
    if(selectedCategory) {
      return compareStrings(category.name, name) && category.id !== selectedCategory.id;
    }
    return compareStrings(category.name, name);
  });

  if (nameExists) {
    return true;
  } else {
    return false;
  }
};