import { createDocFunction } from 'assets/functions/fetchFunctions';
import { ITransaction } from 'assets/interfaces/interfaces';
import { useShowAddForm, useChosenType } from 'assets/state/hooks/addTransactionHooks';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useUser } from 'assets/state/hooks/useUser';
import {  useState } from 'react';
import styles from './AddTransactionForm.module.scss';

interface Props {
  handleFetchTransactionsMonth: () => void,
  handleFetchTransactionsAll: () => Promise<void>
}

const AddTransactionForm = (props: Props) => {
  const { handleFetchTransactionsMonth, handleFetchTransactionsAll } = props;

  const [user,] = useUser();
  const [categories, ] = useCategories();
  const [showAddForm, setShowAddForm] = useShowAddForm();
  const [transactionType,] = useChosenType();
  const [account, setAccount] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // useEffect(() => {
  //   if (user) {
  //     handleFetchCategories();
  //   }
  // }, [user]);

  // const handleFetchCategories = async () => {
  //   if (user) {
  //     try {
  //       const response = await newFetchFunction('categories', user.uid);
  //       setCategories(response as ICategory[]);
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         alert(error.message);
  //         throw error;
  //       }
  //     }
  //   }
  // };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const transaction = getTransactionDoc();
      try {
        await createDocFunction('transactions', user.uid, transaction);
        alert('Transactions successfully added');
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
      resetForm();
      handleCloseButton();
      handleFetchTransactionsMonth();
      handleFetchTransactionsAll();
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
    setAmount('');
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
  };

  return (
    <>
      {
        showAddForm ?
          (
            <div className={styles.addtransactionform__background}>
              <section className={styles.addtransactionform__container}>
                <button
                  className={styles.addtransactionform__closebutton}
                  type='button'
                  onClick={handleCloseButton}
                >+</button>
                <h2 className={styles.addtransactionform__title}>Add a new {transactionType === 'income' ? 'Income' : 'Expense'}</h2>
                <form onSubmit={handleFormSubmit}>
                  <label htmlFor='transactiondescription'>Description:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='transactiondescription'
                    name='transactiondescription'
                    required
                    type="text"
                    onChange={(event) => setDescription(event.target.value)}
                    value={description}
                  />
                  <label htmlFor='transactionamount'>{transactionType === 'income' ? 'Amount ($)' : 'Price ($)'}:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='transactionamount'
                    name='transactionamount'
                    required
                    type="number"
                    onChange={(event) => setAmount(event.target.value)}
                    value={amount}
                  />
                  <label>
                    Category:
                    <select className={styles.addtransactionform__input} value={category} onChange={(e) => setCategory(e.target.value)}>
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
                  <label htmlFor='transactiondate'>Date:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='transactiondate'
                    name='transactiondate'
                    required
                    type="date"
                    onChange={(event) => setTransactionDate(event.target.value)}
                    value={transactionDate}
                  />
                  < label htmlFor='account'>{transactionType === 'income' ? 'Account' : 'Payment Account'}:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='account'
                    name='account'
                    required
                    type="text"
                    onChange={(event) => setAccount(event.target.value)}
                    value={account}
                  />
                  <label htmlFor='transactionnote'>Notes:</label>
                  <textarea
                    className={styles.addtransactionform__note}
                    id='transactionnote'
                    name='transactionnote'
                    onChange={(event) => setNote(event.target.value)}
                    value={note}
                    placeholder='(optional) take any notes you may find useful about this transaction.'
                  />
                  <button className={styles.addtransactionform__button} type='submit'>{
                    transactionType === 'income' ? ('Add Income') : ('Add Expense')
                  }</button>
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