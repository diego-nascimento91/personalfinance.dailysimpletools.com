import styles from './AddCategory.module.scss';
import AddCategoryForm from './AddCategoryForm/AddCategoryForm';
import UserCategories from './UserCategories/UserCategories';
import PageWrapperLoggedIn from 'components/PageWrapperLoggedIn/PageWrapperLoggedIn';

const AddCategory = () => {

  return (
    <PageWrapperLoggedIn customStyles={styles.addCategoryPage__container}>
      <AddCategoryForm />
      <UserCategories />
    </PageWrapperLoggedIn>
  );
};

export default AddCategory;