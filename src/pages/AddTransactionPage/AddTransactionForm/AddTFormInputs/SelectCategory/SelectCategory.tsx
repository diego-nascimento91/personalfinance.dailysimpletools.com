import { useNavigate } from 'react-router-dom';
import { ICategory } from 'utils/interfaces';
import { FormTypeData } from '../../utils/formTypes';
import styles from './SelectCategory.module.scss';
import { useCategories } from 'state/hooks/categories';
import { useSelectedTransaction_toBeEdited } from 'state/hooks/transactions';

interface Props {
  amount: number,
  category: string,
  categoryDescription: string,
  isIncomeExpenseTransaction: boolean,
  updateFields: ((fields: Partial<FormTypeData>) => void)
}
const SelectCategory = (props: Props) => {
  const { amount, category, categoryDescription, isIncomeExpenseTransaction, updateFields } = props;
  const nav = useNavigate();
  const [categories] = useCategories();
  const [currentTransaction] = useSelectedTransaction_toBeEdited();

  const handleSetCategory = (value: string) => {
    if (value === 'addcategory') {
      nav('/newcategory');
      return;
    }

    updateFields({ category: value });
    if (value && value.length > 0) {
      const item: ICategory = JSON.parse(value);
      updateFields({ categoryDescription: item.description });
    } else {
      updateFields({ categoryDescription: '' });
    }
  };

  const categoryExists = () => {
    if (currentTransaction && isIncomeExpenseTransaction && !(categories.map(item => (item.id)).includes(currentTransaction.category?.id)) && category === '')
      return false; // account === '' is to change this condition in case user selects another account
    return true;
  };

  return (
    <label className={styles.selectCategory}> Which category?
      <select className={styles.selectCategory__select} value={category} onChange={(e) => handleSetCategory(e.target.value)} required>
        <option value="" ></option>

        {categories && categories.length > 0 && amount !== 0 && (
          categories.map(item => (
            item.type === (amount >= 0 ? 'income' : 'expense')
              ? (
                <option value={JSON.stringify(item)} key={item.id}>{item.ordering ? `${item.ordering} - ` : null}{item.name}</option>
              )
              : item.type === 'other' && <option value={JSON.stringify(item)} key={item.id}>{item.name}</option>
          )))
        }

        <option value="" disabled>...</option>
        <option value="addcategory">Add new category</option>
      </select>

      {!categoryExists() && currentTransaction && isIncomeExpenseTransaction && (
        <div role='alert' className={styles.selectCategory__categoryDeletedAlert}>
          The category of this transaction has been deleted. Choose another category to update this transaction.
        </div>
      )}

      {categoryDescription && categoryDescription.length > 0 &&
        <p className={styles.selectCategory__categoryDescription}>{categoryDescription}</p>
      }

    </label>
  );
};

export default SelectCategory;