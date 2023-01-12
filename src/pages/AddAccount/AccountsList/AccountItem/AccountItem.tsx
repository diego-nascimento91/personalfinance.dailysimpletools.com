import { handleDeleteDocFunction, handleFetchCategories, handleFetchOnlyUserCategories } from 'assets/functions/handleDatabaseFunctions';
import { ICategory } from 'assets/interfaces/interfaces';
import { useSelectedCategory, useUserCategories } from 'assets/state/hooks/addCategoryHooks';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './UserCategory.module.scss';

interface Props {
  category: ICategory
}
const UserCategory = (props: Props) => {
  const { category } = props;

  const [user] = useUser();
  const [, setCategories] = useCategories();
  const [, setUserCategories] = useUserCategories();
  const [, setSelectedCategory] = useSelectedCategory();

  const handleEditButtonClick = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setSelectedCategory({...category});
  };

  const handleDeleteButtonClick = async () => {
    if (user) {
      await handleDeleteDocFunction('categories', user.uid, category);

      handleFetchCategories(setCategories, user.uid);
      handleFetchOnlyUserCategories(setUserCategories, user.uid);
    }
  };

  return (
    <div className={styles.userCategory__container}>
      <div className={styles.userCategory__img}>
        {
          category.icon && category.icon.length > 0
            ? (
              <img className={styles['userCategory__img--icon']} src={category.icon} />
            )
            : (
              <span className={styles['userCategory__img--iconText']} >{category.value[0]}</span>
            )
        }
      </div>
      <div className={styles['userCategory__nameAndType--container']}>
        <p className={styles['userCategory__nameAndType--name']}>{category.value}</p>
        <p className={styles['userCategory__nameAndType--type']}>{category.type[0].toUpperCase() + category.type.substring(1)} category</p>
      </div>
      <div className={styles.userCategory__buttons}>
        <button className={styles.userCategory__button} role='button' onClick={handleEditButtonClick}>edit</button>
        <button className={styles.userCategory__button} role='button' onClick={handleDeleteButtonClick}>delete</button>
      </div>
    </div>
  );
};

export default UserCategory;