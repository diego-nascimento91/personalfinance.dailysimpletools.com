import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { handleCreateDocFunction, handleFetchCategories, handleFetchOnlyUserCategories, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { ICategory, ITransactionType } from 'assets/interfaces/interfaces';
import { useSelectedCategory, useUserCategories } from 'assets/state/hooks/addCategoryHooks';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import { isCategoryNameInvalid } from './isCategoryNameInvalid';
import styles from './AddCategoryForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import IconPreview from './IconPreview/IconPreview';


const AddCategoryForm = () => {
  const nav = useNavigate();
  const [user] = useUser();
  const [categories, setCategories] = useCategories();
  const [, setUserCategories] = useUserCategories();
  const [selectedCategory, setSelectedCategory] = useSelectedCategory();

  // 👇 useState forms
  const [name, setName] = useState('');
  const [type, setType] = useState<ITransactionType | ''>('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  // ☝️ useState forms

  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    if (selectedCategory) handleSelectedCategoryFormLoad();
  }, [selectedCategory]);

  useEffect(() => {
    setCategoryError(isCategoryNameInvalid(name, type, categories, selectedCategory));
  }, [name, type]);

  const handleSelectedCategoryFormLoad = () => {
    if (selectedCategory) {
      const editValue = selectedCategory.value;
      const editType = selectedCategory.type;
      const editDescription = selectedCategory.description;
      const editIcon = selectedCategory.icon;
      setName(editValue);
      setType(editType);
      setDescription(editDescription);
      setIcon(editIcon);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (categoryError) {
      alert('Please check the category name and/or type of category!');
      return;
    }

    if (user) {
      const category = getCategoryObj();
      if (selectedCategory) {
        await handleUpdateDocFunction('categories', user.uid, { ...category, id: selectedCategory.id });
      } else {
        await handleCreateDocFunction('categories', user.uid, category);
      }

      handleFetchCategories(setCategories, user.uid);
      handleFetchOnlyUserCategories(setUserCategories, user.uid);
      resetForm();
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
    setType('');
    setDescription('');
    setIcon('');
    setSelectedCategory(null);
  };

  const handleReturnButton = () => {
    setSelectedCategory(null);
    if (window.history.state && window.history.state.idx > 0) {
      nav(-1);
    } else {
      nav('/', { replace: true }); // return to home if there is no back page history
    }
  };

  return (
    <section className={`${stylesComponents.pageComponents} ${styles.addCategoryForm__container}`}>
      <BsArrowLeft className={styles.addCategoryForm__returnPage} role='button' onClick={handleReturnButton} />
      {
        selectedCategory
          ? (
            <>
              <h2>Edit Selected Category</h2>
              <button className={styles.addCategoryForm__cancelUpdate} onClick={resetForm}>Cancel Update Transaction</button>
            </>
          )
          : (
            <h2>Add a new Category</h2>
          )
      }

      <form onSubmit={handleFormSubmit} data-testid="addCategoryForm">
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
        {
          categoryError && <span className={styles.addCategoryForm__categoryErrorMsg} role='alert'>This category&apos;s name already exists for the type chosen. Please choose another name.</span>
        }
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
            className={`${styles.addCategoryForm__inputs} ${styles.addCategoryForm__inputIcon}`}
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder='(optional) paste a link of an icon you would like to use.'
          />
        </label>
        <IconPreview name = {name} icon = {icon}/>
        <button className={styles.addCategoryForm__button} type='submit' disabled={categoryError}>
          {
            selectedCategory
              ? 'Update Category'
              : 'Add Category'
          }
        </button>
      </form>
    </section>
  );
};

export default AddCategoryForm;