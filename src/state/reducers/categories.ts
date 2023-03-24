import { useCategories } from 'state/hooks/categories';
import { useUser } from 'state/hooks/user';
import { ICategory, IOrderConfig } from 'utils/interfaces';
import FirebaseFirestoreService from 'services/FirebaseFirestoreService';
import { successToast } from 'state/utils/toast';

export const useFetchCategories = () => {
  const [user] = useUser();
  const [, setCategories] = useCategories();

  const fetchCategories = async () => {
    if (user) {
      try {
        // default categories
        const collectionPathDefault = 'categories';
        const orderConfigDefault: IOrderConfig[] = [{ fieldName: 'ordering', orderDirection: 'asc' }];
        const categoriesDefault = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPathDefault, orderConfigDefault);

        // user categories
        const collectionPathUser = `users/${user.uid}/categories`;
        const orderConfigUser: IOrderConfig[] = [{ fieldName: 'name', orderDirection: 'asc' }];
        const categoriesUser = await FirebaseFirestoreService.readAllDocsFromCollection(collectionPathUser, orderConfigUser);

        const categoriesDB = [...categoriesUser, ...categoriesDefault];
        setCategories(categoriesDB as ICategory[]);

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
  return fetchCategories;
};

export const useAddNewCategory = () => {
  const [user] = useUser();
  const [, setCategories] = useCategories();

  return async (category: ICategory) => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/categories`;
        const docRef = await FirebaseFirestoreService.createDocument(collectionPath, category);
        if (docRef) {
          const docUploaded = await FirebaseFirestoreService.readDocumentRef(docRef) as ICategory;

          // adding new doc to the categories state
          setCategories(categories => {
            const newCategories = [...categories, docUploaded];
            newCategories.sort((a, b) => {
              const nameA = a.name.toUpperCase(); // ignore upper and lowercase
              const nameB = b.name.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            return newCategories;
          });
          successToast('Category added successfully!');
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useUpadateCategory = () => {
  const [user] = useUser();
  const [categories, seCategories] = useCategories();

  return async (category: ICategory) => {
    if (user) {
      try {
        const collectionPath = `users/${user.uid}/categories`;

        const categoryWithoutID = { ...category };
        delete categoryWithoutID.id;
        await FirebaseFirestoreService.updateDocument(collectionPath, categoryWithoutID, category.id as string);

        const index = categories.findIndex(item => item.id === category.id);
        if (index !== -1) {
          seCategories(prev => {
            const newArray = [...prev];
            newArray[index] = category;
            return newArray;
          });
        }
        successToast('Category updated successfully!');

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};

export const useDeleteCategory = () => {
  const [user] = useUser();
  const [categories, setCategories] = useCategories();

  return async (category: ICategory) => {
    const deleteConfirmation = window.confirm('Are you sure you want to delete this category?\nOk for Yes. Cancel for No.');

    if (user && deleteConfirmation) {
      const collectionPath = `users/${user.uid}/categories`;
      try {
        await FirebaseFirestoreService.deleteDocument(collectionPath, category.id as string);

        const index = categories.findIndex(item => item.id === category.id);
        if (index !== -1) {
          setCategories(prev => {
            const newArray = [...prev];
            newArray.splice(index, 1);
            return newArray;
          });
        }
        successToast('Category deleted successfully!');

      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };
};