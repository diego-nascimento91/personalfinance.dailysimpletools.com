import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { handleCreateDocFunction, handleFetchRecentTransactions, handleFetchTransactionsMonth, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { ICategory, ITransaction, ITransactionType } from 'assets/interfaces/interfaces';
import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { useAccounts, useCategories, useChosenMonth, useRecentTransactions, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddTransactionForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import InputCurrency from 'components/InputCurrency/InputCurrency';


const AddTransactionForm = () => {
  const nav = useNavigate();
  const [user] = useUser();
  const [, setRecentTransactions] = useRecentTransactions();
  const [, setTransactionsMonth] = useTransactionsMonth();
  const [month] = useChosenMonth();
  const [categories] = useCategories();
  const [accounts] = useAccounts();
  const [currentTransaction, setCurrentTransaction] = useCurrentTransaction();

  // 👇 form states
  const [name, setName] = useState('');
  const [transactionType, setTransactionType] = useState<ITransactionType | null>(null);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [account, setAccount] = useState('');
  const [notes, setNotes] = useState('');
  // ☝️ form states

  useEffect(() => {
    if (user && currentTransaction) {
      handleCurrentTransactionFormLoad();
    }
  }, [currentTransaction, user]);


  const handleCurrentTransactionFormLoad = () => {
    if (currentTransaction) {
      setName(currentTransaction.description);
      setTransactionType(currentTransaction.type);
      setAmount(currentTransaction.type === 'expense' ? -currentTransaction.amount : + currentTransaction.amount);

      //category
      const categoryObj = categories.find(item => (item.value === currentTransaction.category));
      if (categoryObj) setCategory(JSON.stringify(categoryObj));
      //category

      setTransactionDate(currentTransaction.date.toISOString().split('T')[0]);

      //account
      //Here the code is looking fo the object in account that is the same obj of currentTransaction.account. The reason it's doing this is because when doing sringify(currentTransaciton.account) and stringify(account), the strings the result of them are different and so the Account of current transaction doesn't load on the Edit Form because the sequence of the obj properties changes (not sure why this happens).
      const accountObj = accounts.find(item => (item.name === currentTransaction.account.name));
      if (accountObj) setAccount(JSON.stringify(accountObj));
      //account 

      setNotes(currentTransaction.note);
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
      handleFetchRecentTransactions(user.uid, setRecentTransactions);
      handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
    }
  };

  const getTransactionDoc = () => {
    const transaction: ITransaction = {
      description: name,
      type: transactionType as ITransactionType,
      amount: Math.abs(amount),
      category: JSON.parse(category).value,
      date: new Date(transactionDate.replace(/-/g, '/')), //replace '-' per '/' makes the date to be created in the user timezone, instead of UTC
      account: JSON.parse(account),
      note: notes,
      publishDate: new Date(),
    };

    return transaction;
  };

  const resetForm = () => {
    setName('');
    setTransactionType(null);
    setAmount(0);
    setCategory('');
    setCategoryDescription('');
    setTransactionDate((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    setAccount('');
    setNotes('');
  };

  const handleReturnButton = () => {
    setCurrentTransaction(null);
    if (window.history.state && window.history.state.idx > 0) {
      nav(-1);
    } else {
      nav('/', { replace: true }); // return to home if there is no back page history
    }
  };

  const handleSetCategory = (value: string) => {
    if (value === 'addcategory') {
      nav('/newcategory');
      return;
    }

    setCategory(value);
    if (value && value.length > 0) {
      const item: ICategory = JSON.parse(value);
      setCategoryDescription(item.description);
    } else {
      setCategoryDescription('');
    }
  };

  const handleSetAccount = (value: string) => {
    if (value === 'addaccount') {
      nav('/newaccount');
      return;
    }
    setAccount(value);
  };

  const getFormTitle = () => {
    if (currentTransaction) return 'Update Transaction';
    if (transactionType === 'income') return 'Add a new Income';
    if (transactionType === 'expense') return 'Add a new Expense';
    return 'Add a new Transaction';
  };

  const setTypeTransactionOnAmountChange = (amount: number) => {
    if (amount === 0) 
      setTransactionType(null);
    else if(amount > 0)
      setTransactionType('income');
    else
      setTransactionType('expense');
  };


  return (
    <section className={`${stylesComponents.pageComponents} ${styles.addTransactionForm__container}`}>
      <div id='form-header'>
        <BsArrowLeft
          className={styles.addTransactionForm__returnPage}
          role='button'
          onClick={handleReturnButton}
        />
        <h2 className={styles.addTransactionForm__title}>{getFormTitle()}</h2>
      </div>

      <form onSubmit={handleFormSubmit}>
        <label className={styles.addTransactionForm__label}> How would you like to call this transaction?
          <input
            className={styles.addTransactionForm__input}
            required
            type="text"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>

        <label className={styles.addTransactionForm__label}> How much was it?
          <InputCurrency 
            setMoneyAmount={setAmount} 
            moneyAmount={amount}
            onChange={setTypeTransactionOnAmountChange}
          />
        </label>

        <label className={styles.addTransactionForm__label}> Which category?
          <select
            className={styles.addTransactionForm__input}
            value={category}
            onChange={(e) => handleSetCategory(e.target.value)}
            required
          >
            <option value=""></option>
            {
              categories && categories.length > 0 && transactionType
                ? (
                  categories.map(item => (
                    item.type === transactionType
                      ? (
                        <option value={JSON.stringify(item)} key={item.id}>{item.ordering ? `${item.ordering} - ` : null}{item.value}</option>
                      )
                      : item.type === 'other'
                        ? (
                          <option value={JSON.stringify(item)} key={item.id}>{item.value}</option>
                        )
                        : null
                  ))
                )
                : null
            }
            <option value="">...</option>
            <option value="addcategory">Add a new category</option>
          </select>

          <p className={styles.addTransactionForm__categoryDescription}>
            {
              categoryDescription && categoryDescription.length > 0
                ? (
                  categoryDescription
                )
                : null
            }
          </p>
        </label>

        <label className={styles.addTransactionForm__label}> Which date?
          <input
            className={`${styles.addTransactionForm__input} ${styles.addTransactionForm__inputDate}`}
            required
            type="date"
            onChange={(event) => setTransactionDate(event.target.value)}
            value={transactionDate}
          />
        </label>

        <label className={styles.addTransactionForm__label}> Which account?
          <select
            className={styles.addTransactionForm__input}
            value={account}
            onChange={(e) => handleSetAccount(e.target.value)}
            required
          >
            <option value=""></option>
            {
              accounts && accounts.length > 0
                ? (accounts.map(item => (
                  <option value={JSON.stringify(item)} key={item.id}>{item.name}</option>
                )))
                : null
            }
            <option value="">...</option>
            <option value="addaccount">Add a new account</option>
          </select>
        </label>

        <label className={styles.addTransactionForm__label}> Notes:
          <textarea
            className={styles.addTransactionForm__notes}
            onChange={(event) => setNotes(event.target.value)}
            value={notes}
            placeholder='(optional) take any notes you may find useful about this transaction.'
          />
        </label>

        <button className={styles.addTransactionForm__button} type='submit'>
          {
            currentTransaction
              ? ('Update Transaction')
              : transactionType === 'income' ? 'Add Income'
                : transactionType === 'expense' ? 'Add Expense' : 'Add Transaction'
          }
        </button>
      </form>
    </section>
  );
};

export default AddTransactionForm;