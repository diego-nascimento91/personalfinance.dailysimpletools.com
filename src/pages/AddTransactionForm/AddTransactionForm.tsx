import { useEffect, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { handleCreateDocFunction, handleFetchRecentTransactions, handleFetchTransactionsMonth, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { ICategory, ITransaction, ITransactionType } from 'assets/interfaces/interfaces';
import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { useAccounts, useCategories, useChosenMonth, useRecentTransactions, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddTransactionForm.module.scss';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';


const AddTransactionForm = () => {
  const nav = useNavigate();
  const [user,] = useUser();
  const [, setRecentTransactions] = useRecentTransactions();
  const [, setTransactionsMonth] = useTransactionsMonth();
  const [month] = useChosenMonth();
  const [categories,] = useCategories();
  const [accounts,] = useAccounts();
  const [currentTransaction, setCurrentTransaction] = useCurrentTransaction();
  const [transactionType, setTransactionType] = useState<ITransactionType | null>(null);
  const [account, setAccount] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState<number>();
  const [transactionDate, setTransactionDate] = useState((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (currentTransaction) {
      handleCurrentTransactionFormLoad();
    }
  }, [currentTransaction]);

  const handleCurrentTransactionFormLoad = () => {
    if (currentTransaction) {
      setDescription(currentTransaction.description);
      setTransactionType(currentTransaction.type);
      setAmount(currentTransaction.amount);
      //category
      const categoryObj = categories.find(item => (item.value === currentTransaction.category));
      if (categoryObj) setCategory(JSON.stringify(categoryObj));

      setTransactionDate(currentTransaction.date.toISOString().split('T')[0]);
      setAccount(currentTransaction.account);
      setNote(currentTransaction.note);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const transaction = getTransactionDoc();
      if (currentTransaction) {
        await handleUpdateDocFunction('transactions', user.uid, { ...transaction, id: currentTransaction.id });
      } else {
        await handleCreateDocFunction('transactions', user.uid, transaction);
      }
      resetForm();
      setCurrentTransaction(null);
      handleReturnButton();
      handleFetchRecentTransactions(user.uid, setRecentTransactions);
      handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
    }
  };

  const getTransactionDoc = () => {
    const transaction: ITransaction = {
      description: description,
      amount: amount as number,
      category: JSON.parse(category).value,
      date: new Date(transactionDate.replace(/-/g, '/')), //replace '-' per '/' makes the date to be created in the user timezone, instead of UTC
      account: account,
      note: note,
      publishDate: new Date(),
      type: transactionType as ITransactionType,
    };

    return transaction;
  };

  const resetForm = () => {
    setDescription('');
    setCategoryDescription('');
    setAmount(0);
    setCategory('');
    setTransactionDate((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    setAccount('');
    setNote('');
  };

  const handleReturnButton = () => {
    setCurrentTransaction(null);
    if (window.history.state && window.history.state.idx > 0) {
      nav(-1);
    } else {
      nav('/', { replace: true }); // return to home if there is no back page history
    }
  };

  const handleSelectingCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategory(value);
    if (value && value.length > 0) {
      const item: ICategory = JSON.parse(e.target.value);
      setCategoryDescription(item.description);
    } else {
      setCategoryDescription('');
    }
  };

  const getFormTitle = () => {
    if (currentTransaction) return 'Update Transaction';
    if (transactionType === 'income') return 'Add a new Income';
    if (transactionType === 'expense') return 'Add a new Expense';
    return 'Add a new Transaction';
  };

  const handleTypeTransactionOptionClick = (type: ITransactionType) => {
    if (type === transactionType) {
      setTransactionType(null);
    } else {
      setTransactionType(type);
    }
    setCategory('');
    setCategoryDescription(''); // to reset the category so the full description does not keep on the screen
  };

  return (
    <div className={`theme__padding theme__page ${styles.newTransactionPage__container}`}>
      <section className={`theme__homesections ${styles.addtransactionform__container}`}>
        <BsArrowLeft className={styles.addtransactionform__returnPage} role='button' onClick={handleReturnButton} />
        <h2 className={styles.addtransactionform__title}>{getFormTitle()}</h2>
        <form onSubmit={handleFormSubmit}>
          <label className={styles.addtransactionform__label}>
            How would you like to call this transaction?
            <input
              className={styles.addtransactionform__input}
              required
              type="text"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>

          <label className={styles.addtransactionform__label}>
            How much was it?
            <div role='select' className={styles.addtransactionform__typeOptions}>
              <div
                role='option'
                className={classNames({
                  [styles.addtransactionform__typeOption]: true,
                  [styles.addtransactionform__typeOptionSelected]: transactionType === 'income'
                })}
                onClick={() => handleTypeTransactionOptionClick('income')}
              >+ $</div>
              <div
                role='option'
                className={classNames({
                  [styles.addtransactionform__typeOption]: true,
                  [styles.addtransactionform__typeOptionSelected]: transactionType === 'expense'
                })}
                onClick={() => handleTypeTransactionOptionClick('expense')}
              >- $</div>
            </div>
            <input
              className={styles.addtransactionform__input}
              required
              type="number"
              min='0'
              onChange={(event) => setAmount(+event.target.value)}
              value={amount}
            />
          </label>

          <label className={styles.addtransactionform__label}>
            Which category?
            <select
              className={styles.addtransactionform__input}
              value={category}
              onChange={handleSelectingCategory}
              required
            >
              <option value=""></option>
              {
                categories && categories.length > 0 && transactionType
                  ? (
                    categories.map(item => (
                      item.type === transactionType
                        ? (
                          <option value={JSON.stringify(item)} key={item.id}>{item.ordering} - {item.value}</option>
                        )
                        : item.type === 'other'
                          ? (
                            <option value={JSON.stringify(item)} key={item.id}> {item.value}</option>
                          )
                          : null
                    ))
                  )
                  : null
              }
            </select>
          </label>

          <p className={styles.addtransactionform__categoryDescription}>
            {
              categoryDescription && categoryDescription.length > 0
                ? (
                  categoryDescription
                )
                : null
            }
          </p>

          <label className={styles.addtransactionform__label}>
            Which date?
            <input
              className={`${styles.addtransactionform__input} ${styles.addtransactionform__inputdate}`}
              required
              type="date"
              onChange={(event) => setTransactionDate(event.target.value)}
              value={transactionDate}
            />
          </label>

          <label className={styles.addtransactionform__label}>
            Which account?
            <select
              className={styles.addtransactionform__input}
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            >
              <option value=""></option>
              {
                accounts && accounts.length > 0
                  ? (
                    accounts.map(item => (
                      <option value={item.value} key={item.id}>{item.value}</option>
                    ))
                  )
                  : null
              }
            </select>
          </label>

          <label className={styles.addtransactionform__label}>
            Notes:
            <textarea
              className={styles.addtransactionform__note}
              onChange={(event) => setNote(event.target.value)}
              value={note}
              placeholder='(optional) take any notes you may find useful about this transaction.'
            />
          </label>

          <button className={styles.addtransactionform__button} type='submit'>
            {
              currentTransaction
                ? ('Update Transaction')
                : transactionType === 'income' ? 'Add Income'
                  : transactionType === 'expense' ? 'Add Expense' : 'Add Transaction'
            }
          </button>

        </form>
      </section>
    </div>
  );
};

export default AddTransactionForm;