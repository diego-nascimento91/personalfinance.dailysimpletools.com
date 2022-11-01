import { useUserCategories } from 'assets/state/hooks/addCategoryHooks';
import styles from './UserCategories.module.scss';
import UserCategory from './UserCategory/UserCategory';


const UserCategories = () => {
  const [userCategories] = useUserCategories();

  return (
    <section className={`theme__homesections ${styles.userCategories__container}`}>
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
