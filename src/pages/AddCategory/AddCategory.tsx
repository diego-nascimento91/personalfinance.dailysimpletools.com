import { useEffect } from 'react';
import styles from './AddCategory.module.scss';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'assets/state/hooks/firebaseHooks';
import AddCategoryForm from './AddCategoryForm/AddCategoryForm';

const AddCategory = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
  }, [user]);

  return (
    <div className={`theme__page theme__padding ${styles.addCategoryPage__container}`}>
      <AddCategoryForm />
    </div>
  );
};

export default AddCategory;