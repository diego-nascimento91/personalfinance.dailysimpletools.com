import { useEffect, useState } from 'react';
import { ICategory, ITransactionType } from 'assets/interfaces/interfaces';
import styles from './AddCategory.module.scss';
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import { handleCreateDocFunction, handleFetchCategories } from 'assets/functions/handleDatabaseFunctions';

const AddCategory = () => {

  const nav = useNavigate();
  const [user, loading] = useUser();
  const [, setCategories] = useCategories();
  const [name, setName] = useState('');
  const [type, setType] = useState<ITransactionType>();
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
  }, [user]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const category = getCategoryObj();
      await handleCreateDocFunction('categories', user.uid, category);

      handleFetchCategories(setCategories, user.uid);
      resetForm();
      handleReturnButton();
    }
  };

  const getCategoryObj = () => {
    const categoryObj: ICategory = {
      value: name,
      type: type as ITransactionType,
      description: description,
      icon: icon,
    };

    return categoryObj;
  };

  const resetForm = () => {
    setName('');
    setType(undefined);
    setDescription('');
    setIcon('');
  };

  const handleReturnButton = () => {
    if (window.history.state && window.history.state.idx > 0) {
      nav(-1);
    } else {
      nav('/', { replace: true }); // return to home if there is no back page history
    }
  };

  return (
    <div className={`theme__page theme__padding ${styles.addCategoryPage__container}`}>
      <section className={`theme__homesections ${styles.addCategoryForm__container}`}>
        <BsArrowLeft className={styles.addCategoryForm__returnPage} role='button' onClick={handleReturnButton} />
        <h2>Add a new Category</h2>
        <form onSubmit={handleFormSubmit}>
          <label className={styles.addCategoryForm__labels}>
            How would like to call this Category?
            <input
              className={styles.addCategoryForm__inputs}
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className={styles.addCategoryForm__labels}>
            Type:
            <select
              className={styles.addCategoryForm__selects}
              required
              value={type}
              onChange={(e) => setType(e.target.value as ITransactionType)}
            >
              <option value=""></option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className={styles.addCategoryForm__labels}>
            Description:
            <textarea
              className={styles.addCategoryForm__textareas}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='(optional) write down examples of transactions to be used with this category.'
              style={{ 'width': '100%' }}
            />
          </label>
          <label className={styles.addCategoryForm__labels}>
            Icon:
            <input
              className={styles.addCategoryForm__inputs}
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder='(optional) paste a link of an icon you would like to use.'
            />
          </label>
          {
            icon && icon.length > 0
              ? (
                <img className={styles.addCategoryForm__iconPreview} src={icon} alt="icon" />
              )
              : null
          }

          <button className={styles.addCategoryForm__button} type='submit'>Add Category</button>
        </form>
      </section>
    </div>
  );
};

export default AddCategory;