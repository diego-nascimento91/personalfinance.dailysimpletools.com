import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormTypeData } from './utils/formTypes';
import { loadCurrentTransaction, resetForm, submitForm, useMultitabForm } from './utils/formFunctions';
import { useCategories } from 'state/hooks/categories';
import { useUser } from 'state/hooks/user';
import { useAccounts } from 'state/hooks/accounts';
import { useAddNewTransaction, useAddNewTransferTransaction, useUpadateTransaction } from 'state/reducers/transactions';
import { useSelectedTransaction_toBeEdited, useTransactions } from 'state/hooks/transactions';
import { returnPage } from 'utils/returnPage';
import classNames from 'classnames';
import styles from './AddTransactionForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import AddTFormHeader from './AddTFormHeader/AddTFormHeader';
import AddTFormOptionTabs from './AddTFormOptionTabs/AddTFormOptionTabs';
import AddTFormInputs from './AddTFormInputs/AddTFormInputs';


const INITIAL_DATA: FormTypeData = {
  name: '',
  amount: 0,
  category: '',
  categoryDescription: '',
  transactionDate: (new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0],
  transactionType: null,
  account: '',
  accountTo: '',
  notes: '',
  //states for transfer transaction type
  transactionIDFrom: '',
  transactionIDTo: '',
  accountIDFrom: '',
  accountIDTo: '',
};

const AddTransactionForm = () => {
  const nav = useNavigate();
  
  const [data, setData] = useState(INITIAL_DATA);
  const updateFields = (fields: Partial<FormTypeData>) => {
    setData(prev => {
      return { ...prev, ...fields };
    });
  };

  const [user] = useUser();
  const [accounts] = useAccounts();
  const [categories] = useCategories();
  const [currentTransaction, setCurrentTransaction] = useSelectedTransaction_toBeEdited();
  const [transactionsMonth, ] = useTransactions();

  const addNewTransaction = useAddNewTransaction();
  const addNewtransferTransaction = useAddNewTransferTransaction();
  const updateTransaction = useUpadateTransaction();

  const { isUpdateTransaction, isTransferTransaction, isIncomeExpenseTransaction, formTitle, formButtonText, goToTab } = useMultitabForm(data.amount);

  useEffect(() => {
    if (user && currentTransaction) {
      loadCurrentTransaction(accounts, categories, currentTransaction, isTransferTransaction, transactionsMonth, updateFields);
    }
  }, [currentTransaction, user]);


  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      await submitForm(currentTransaction, data, isIncomeExpenseTransaction, isUpdateTransaction, user.uid, addNewTransaction, addNewtransferTransaction, updateTransaction);

      resetForm(updateFields);
      if (isUpdateTransaction) {
        setCurrentTransaction(null);
        returnPage(nav);
      }
    }
  };

  return (
    <section className={`${stylesComponents.pageComponents} ${styles.addTransaction__container}`}>
      <AddTFormHeader title={formTitle} />
      <AddTFormOptionTabs
        setTabTransactionOption={goToTab}
        isUpdateTransaction={isUpdateTransaction}
        isIncomeExpenseTransaction={isIncomeExpenseTransaction}
        isTransferTransaction={isTransferTransaction}
      />
      <form
        onSubmit={handleFormSubmit}
        className={classNames(styles.addTransaction__form, {
          [styles['addTransaction__form--income-expense']]: isIncomeExpenseTransaction,
          [styles['addTransaction__form--transfer']]: isTransferTransaction,
        })}
      >
        <AddTFormInputs
          {...data} updateFields={updateFields}
          isTransferTransaction={isTransferTransaction}
          isIncomeExpenseTransaction={isIncomeExpenseTransaction}
          buttonTxt={formButtonText}
        />
      </form>

    </section>
  );
};

export default AddTransactionForm;