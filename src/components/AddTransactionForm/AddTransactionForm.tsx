import { useEffect, useState } from 'react';
import { handleCreateDocFunction, handleFetchRecentTransactions, handleFetchTransactionsMonth, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { ITransaction, ITransactionType } from 'assets/interfaces/interfaces';
import { useShowAddFormPopUp, useChosenType, useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { useAccounts, useCategories, useChosenMonth, useRecentTransactions, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddTransactionForm.module.scss';
import classNames from 'classnames';


const AddTransactionForm = () => {
  const [user,] = useUser();
  const [, setRecentTransactions] = useRecentTransactions();
  const [, setTransactionsMonth] = useTransactionsMonth();
  const [month] = useChosenMonth();
  const [categories,] = useCategories();
  const [accounts,] = useAccounts();
  const [showAddForm, setShowAddForm] = useShowAddFormPopUp();
  const [transactionType, setTransactionType] = useChosenType();
  const [currentTransaction, setCurrentTransaction] = useCurrentTransaction();
  const [account, setAccount] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState(0);
  const [transactionDate, setTransactionDate] = useState((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (currentTransaction) {
      setTransactionType(currentTransaction.type);
      setDescription(currentTransaction.description);
      setAmount(currentTransaction.amount);
      setCategory(currentTransaction.category);
      setTransactionDate(currentTransaction.date.toISOString().split('T')[0]);
      setAccount(currentTransaction.account);
      setNote(currentTransaction.note);
    }
  }, [currentTransaction]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const transaction = getTransactionDoc();
      if (currentTransaction) {
        await handleUpdateDocFunction('transactions', user.uid, {...transaction, id: currentTransaction.id});
      } else {
        await handleCreateDocFunction('transactions', user.uid, transaction);
      }
      resetForm();
      setCurrentTransaction(null);
      handleCloseButton();
      handleFetchRecentTransactions(user.uid, setRecentTransactions);
      handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
    }
  };

  const getTransactionDoc = () => {
    const transaction: ITransaction = {
      description: description,
      amount: amount,
      category: category,
      date: new Date(transactionDate.replace(/-/g, '/')), //replace '-' per '/' makes the date to be created in the user timezone, instead of UTC
      account: account,
      note: note,
      publishDate: new Date(),
      type: transactionType,
    };

    return transaction;
  };

  const resetForm = () => {
    setDescription('');
    setAmount(0);
    setCategory('');
    setTransactionDate((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    setAccount('');
    setNote('');
  };

  const handleCloseButton = () => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = 'scroll';
    }
    setShowAddForm(false);
    setCurrentTransaction(null);
  };

  return (
    <>
      {
        showAddForm ?
          (
            <div className={
              classNames({
                [styles.addtransactionform__background]: true,
                [styles.updatetransactionform__container]: currentTransaction
              })
            }>
              <section className={
                classNames({
                  [styles.addtransactionform__container]: true,
                  [styles.updatetransactionform__container]: currentTransaction
                })
              }>
                <div
                  className={styles.addtransactionform__closebutton}
                  role='button'
                  onClick={handleCloseButton}
                >+</div>
                <h2 className={styles.addtransactionform__title}>
                  {
                    currentTransaction
                      ? 'Update Transaction'
                      : `Add a new ${transactionType === 'income' ? 'Income' : 'Expense'}`
                  }
                </h2>
                <form onSubmit={handleFormSubmit}>
                  {
                    currentTransaction
                      ? (
                        <>
                          <label className={styles.addtransactionform__label}>
                            Type:
                            <select
                              className={styles.addtransactionform__input}
                              value={transactionType}
                              onChange={(e) => setTransactionType(e.target.value as ITransactionType)}
                              required
                            >
                              <option value=""></option>
                              <option value='income'>Income</option>
                              <option value='expense'>Expense</option>
                            </select>
                          </label>
                        </>
                      )
                      : null
                  }
                  <label htmlFor='transactiondescription' className={styles.addtransactionform__label}>Description:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='transactiondescription'
                    name='transactiondescription'
                    required
                    type="text"
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                  />
                  <label htmlFor='transactionamount' className={styles.addtransactionform__label}>{transactionType === 'income' ? 'Amount ($)' : 'Price ($)'}:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='transactionamount'
                    name='transactionamount'
                    required
                    type="number"
                    onChange={(event) => setAmount(+event.target.value)}
                    value={amount}
                  />
                  <label className={styles.addtransactionform__label}>
                    Category:
                    <select
                      className={styles.addtransactionform__input}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value=""></option>
                      {
                        categories && categories.length > 0
                          ? (
                            categories.map(item => (
                              item.type === transactionType
                                ? (
                                  <option value={item.value} key={item.id}>{item.ordering} - {item.value}</option>
                                )
                                : item.type === 'other'
                                  ? (
                                    <option value={item.value} key={item.id}> {item.value}</option>
                                  )
                                  : null
                            ))
                          )
                          : null
                      }
                    </select>
                  </label>
                  <label htmlFor='transactiondate' className={styles.addtransactionform__label}>Date:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='transactiondate'
                    name='transactiondate'
                    required
                    type="date"
                    onChange={(event) => setTransactionDate(event.target.value)}
                    value={transactionDate}
                  />
                  <label className={styles.addtransactionform__label}>
                    {transactionType === 'income' ? 'Account' : 'Payment Account'}:
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
                  <label htmlFor='transactionnote' className={styles.addtransactionform__label}>Notes:</label>
                  <textarea
                    className={styles.addtransactionform__note}
                    id='transactionnote'
                    name='transactionnote'
                    onChange={(event) => setNote(event.target.value)}
                    value={note}
                    placeholder='(optional) take any notes you may find useful about this transaction.'
                  />
                  <button className={styles.addtransactionform__button} type='submit'>
                    {
                      currentTransaction
                        ? ('Update Transaction')
                        : transactionType === 'income' ? ('Add Income') : ('Add Expense')
                    }

                  </button>
                </form>
              </section>
            </div>
          )
          : null
      }
    </>

  );
};

export default AddTransactionForm;