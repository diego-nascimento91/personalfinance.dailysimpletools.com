import { useState } from 'react';
import { createDocFunction } from 'assets/functions/fetchFunctions';
import { ITransaction } from 'assets/interfaces/interfaces';
import { useShowAddForm, useChosenType } from 'assets/state/hooks/addTransactionHooks';
import { useAccounts, useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddTransactionForm.module.scss';

interface Props {
  handleUpdateTransactions: () => void,
}

const AddTransactionForm = (props: Props) => {
  const { handleUpdateTransactions } = props;

  const [user,] = useUser();
  const [categories,] = useCategories();
  const [accounts,] = useAccounts();
  const [showAddForm, setShowAddForm] = useShowAddForm();
  const [transactionType,] = useChosenType();
  const [account, setAccount] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState(0);
  const [transactionDate, setTransactionDate] = useState((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

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
      handleUpdateTransactions();
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
                    onChange={(event) => setAmount(+event.target.value)}
                    value={amount}
                  />
                  <label>
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
                  <label>
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