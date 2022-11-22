import { handleCreateDocFunction, handleFetchCategories, handleFetchOnlyUserCategories } from 'assets/functions/handleDatabaseFunctions';
import { ICategory, ITransactionType } from 'assets/interfaces/interfaces';
import { useSelectedCategory, useUserCategories } from 'assets/state/hooks/addCategoryHooks';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import { useEffect, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import styles from './AddCategoryForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import stylesImgError from 'assets/styles/imgError.module.scss';


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

  const [imgError, setImgError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    console.log('selectedCategory changed', selectedCategory);
    if (selectedCategory) handleSelectedCategoryFormLoad();
  }, [selectedCategory]);

  useEffect(() => {
    handleCategoryNameValidation();
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

  const handleCategoryNameValidation = () => {
    // if name or type is empty there is no error
    if (name === '' || type === '') {
      setCategoryError(false);
      return;
    }

    // get all categories of the type chosen by user
    const categoriesOfType = categories.filter(category => {
      return category.type === type;
    });

    // find if there is any name that is equal to the input name
    const nameExists = categoriesOfType.some(category => {
      // if user is editing a current category
      if(selectedCategory) {
        return isEqual(category.value, name) && category.id !== selectedCategory.id;
      }
      return isEqual(category.value, name);
    });

    if (nameExists) {
      setCategoryError(true);
    } else {
      setCategoryError(false);
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
        alert('transaction uptade call');
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

  const isEqual = (a: string, b: string) => {
    const aPure = a.replace(/\s+/g, '');
    const bPure = b.replace(/\s+/g, '');
    return aPure.localeCompare(bPure, undefined, { sensitivity: 'accent' }) === 0;
  };


  return (
    <section className={`${stylesComponents.pageComponents} ${styles.addCategoryForm__container}`}>
      <BsArrowLeft className={styles.addCategoryForm__returnPage} role='button' onClick={handleReturnButton} />
      <>
        {
          selectedCategory
            ? (
              <>
                <h2>Update Category</h2>
                <button className={styles.addCategoryForm__cancelUpdate} onClick={resetForm}>Cancel Update Transaction</button>
              </>
            )
            : (
              <h2>Add a new Category</h2>
            )
        }
      </>

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
        {categoryError && <span className={styles.addCategoryForm__categoryErrorMsg} role='alert'>This category&apos;s name already exists for the type chosen. Please choose another name.</span>}
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
        <>
          {
            icon && icon.length > 0
              ? (
                <>
                  <img className={styles.addCategoryForm__iconPreview} src={icon} alt="icon"
                    onError={({ currentTarget }) => {
                      currentTarget.src = '';
                      currentTarget.className = stylesImgError.imgError;
                      setImgError(true);
                    }}
                  />
                  {
                    imgError
                      ? name && name.length > 0 
                        ? <span className={styles['addCategoryForm__iconPreview--iconText']}>{name[0]}</span>
                        : <span className={`${styles['addCategoryForm__iconPreview--iconText']} ${styles.error}`}>error</span>
                      : null
                  }
                </>
              )
              : name && name.length > 0
                ? <span className={styles['addCategoryForm__iconPreview--iconText']}>{name[0]}</span>
                : null
          }
        </>
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