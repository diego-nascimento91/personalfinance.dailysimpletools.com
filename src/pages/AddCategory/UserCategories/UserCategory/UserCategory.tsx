import { ICategory } from 'utils/interfaces';
import { useSelectedCategory_toBeEdited } from 'state/hooks/categories';
import { useUser } from 'state/hooks/user';
import { useDeleteCategory } from 'state/reducers/categories';
import styles from './UserCategory.module.scss';

interface Props {
  category: ICategory
}
const UserCategory = (props: Props) => {
  const { category } = props;

  const [user] = useUser();
  const [, setSelectedCategory] = useSelectedCategory_toBeEdited();

  const deleteCategory = useDeleteCategory();

  const handleEditButtonClick = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setSelectedCategory({...category});
  };

  const handleDeleteButtonClick = async () => {
    if (user) {
      // await handleDeleteDocFunction('categories', user.uid, category);
      deleteCategory(category);
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
              <span className={styles['userCategory__img--iconText']} >{category.name[0]}</span>
            )
        }
      </div>
      <div className={styles['userCategory__nameAndType--container']}>
        <p className={styles['userCategory__nameAndType--name']}>{category.name}</p>
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