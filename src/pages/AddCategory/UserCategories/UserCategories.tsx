import styles from './UserCategories.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import UserCategory from './UserCategory/UserCategory';
import { useUserCategories } from 'state/hooks/categories';


const UserCategories = () => {
  const userCategories = useUserCategories();

  return (
    <section className={`${stylesComponents.pageComponents} ${styles.userCategories__container}`}>
      <h2>Categories Added</h2>
      <div className={styles.userCategories__userCategoryComponents}>
        {
          userCategories && userCategories.length > 0
            ? (
              <>
                {
                  userCategories.map(category => (
                    category.type === 'income' && <UserCategory key={category.id} category={category} />
                  ))
                }
                {
                  userCategories.map(category => (
                    category.type === 'expense' && <UserCategory key={category.id} category={category} />
                  ))
                }
              </>

            )
            : 'No categories added yet.'
        }
      </div>
    </section>
  );
};

export default UserCategories;
