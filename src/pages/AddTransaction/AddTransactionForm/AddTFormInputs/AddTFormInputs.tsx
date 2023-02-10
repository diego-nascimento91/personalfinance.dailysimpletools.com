import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICategory, ITransactionType } from 'assets/interfaces/interfaces';
import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { returnPage } from 'assets/functions/returnPage';
import { handleCreateDocFunction, handleCreateDocsTransferFunction, handleFetchRecentTransactions, handleFetchTransactionsMonth, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { useAccounts, useCategories, useChosenMonth, useRecentTransactions, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddTFormInputs.module.scss';
import InputCurrency from 'components/InputCurrency/InputCurrency';
import SelectInput from './SelectInput/SelectInput';
import { getTransactionDoc } from './functions/getTrasactionDoc';

interface Props {
  tabTransactionOption: 'income-expense' | 'transfer-withdraw',
  transactionType: ITransactionType | null,
  setTransactionType: React.Dispatch<React.SetStateAction<ITransactionType | null>>
}
const AddTFormInputs = (props: Props) => {
  const { transactionType, setTransactionType, tabTransactionOption } = props;

  // 👇 recoil states
  const [user] = useUser();
  const [month] = useChosenMonth();
  const [categories] = useCategories();
  const [accounts] = useAccounts();
  const [currentTransaction, setCurrentTransaction] = useCurrentTransaction();
  const [, setRecentTransactions] = useRecentTransactions();
  const [, setTransactionsMonth] = useTransactionsMonth();
  // ☝️ recoil states

  // 👇 form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [account, setAccount] = useState('');
  const [accountTo, setAccountTo] = useState('');
  const [notes, setNotes] = useState('');
  // ☝️ form states

  const nav = useNavigate();
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
      
      if(tabTransactionOption === 'income-expense') {
        const transaction = getTransactionDoc(name, transactionType as ITransactionType, amount, transactionDate, account, notes, category);
        if (currentTransaction) {
          await handleUpdateDocFunction('transactions', user.uid, { ...transaction, id: currentTransaction.id });
        } else {
          await handleCreateDocFunction('transactions', user.uid, transaction);
        }
      } else {
        const nameFrom = `Transfer sent to ${JSON.parse(accountTo).name}: ` + name;
        const transactionFrom = getTransactionDoc(nameFrom, 'transfer', -Math.abs(amount), transactionDate, account, notes);
        
        const nameTo = `Transfer received from ${JSON.parse(account).name}: ` + name;
        const transactionTo = getTransactionDoc(nameTo, 'transfer', Math.abs(amount), transactionDate, accountTo, notes);

        await handleCreateDocsTransferFunction('transactions', user.uid, transactionFrom, transactionTo);
      }

      resetForm();
      if (currentTransaction) {
        setCurrentTransaction(null);
        returnPage(nav);
      }
      handleFetchRecentTransactions(user.uid, setRecentTransactions);
      handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
    }
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

  const setTypeTransactionOnAmountChange = (amount: number) => {
    if (amount === 0)
      setTransactionType(null);
    else if (amount > 0)
      setTransactionType('income');
    else
      setTransactionType('expense');
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

  return (
    <form onSubmit={handleFormSubmit} className={styles.addTFormInputs__container}>
      <label className={styles.addTFormInputs__label}> How would you like to call this transaction?
        <input
          className={styles.addTFormInputs__input}
          required
          type="text"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
      </label>

      <label className={styles.addTFormInputs__label}> How much was it?
        <InputCurrency
          setMoneyAmount={setAmount}
          moneyAmount={amount}
          onChange={setTypeTransactionOnAmountChange}
        />
      </label>

      <div id='category'>
        {
          tabTransactionOption === 'income-expense'
            ? (
              <label className={styles.addTFormInputs__label}> Which category?
                <select
                  className={styles.addTFormInputs__input}
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

                <p className={styles.addTFormInputs__categoryDescription}>
                  {
                    categoryDescription && categoryDescription.length > 0
                      ? (
                        categoryDescription
                      )
                      : null
                  }
                </p>
              </label>
            )
            : null
        }
      </div>

      <label className={styles.addTFormInputs__label}> Which date?
        <input
          className={`${styles.addTFormInputs__input} ${styles.addTFormInputs__inputDate}`}
          required
          type="date"
          onChange={(event) => setTransactionDate(event.target.value)}
          value={transactionDate}
        />
      </label>

      <div id='account'>
        {
          tabTransactionOption === 'income-expense'
            ? <SelectInput label='Which account?' account={account} setAccount={setAccount} />
            : <>
              <SelectInput label='From account:' account={account} setAccount={setAccount} />
              <SelectInput label='To account:' account={accountTo} setAccount={setAccountTo} />
            </>
        }
      </div>

      <label className={styles.addTFormInputs__label}> Notes:
        <textarea
          className={styles.addTFormInputs__notes}
          onChange={(event) => setNotes(event.target.value)}
          value={notes}
          placeholder='(optional) take any notes you may find useful about this transaction.'
        />
      </label>

      <button className={styles.addTFormInputs__button} type='submit'>
        {
          currentTransaction
            ? ('Update Transaction')
            : transactionType === 'income' ? 'Add Income'
              : transactionType === 'expense' ? 'Add Expense' : 'Add Transaction'
        }
      </button>
    </form>
  );
};

export default AddTFormInputs;