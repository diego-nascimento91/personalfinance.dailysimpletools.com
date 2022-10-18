import { newFetchFunction } from 'assets/functions/fetchFunctions';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ICategory } from 'assets/interfaces/interfaces';
import { useShowAddForm, useChosenType } from 'assets/state/hooks/addTransactionHooks';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import styles from './AddTransactionForm.module.scss';

interface Props {
  handleFetchTransactionsMonth: () => void,
  handleFetchTransactionsAll: () => Promise<void>
}

const AddTransactionForm = (props: Props) => {
  const { handleFetchTransactionsMonth, handleFetchTransactionsAll } = props;

  const [user,] = useUser();
  const [showAddForm, setShowAddForm] = useShowAddForm();
  const [transactionType,] = useChosenType();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');
  const [publishDate, setPublishDate] = useState((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<ICategory[]>();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user) {
      handleFetchCategories();
    }
  }, [user]);

  const handleFetchCategories = async () => {
    if (user) {
      try {
        const response = await newFetchFunction('categories', user.uid);
        setCategories(response as ICategory[]);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          throw error;
        }
      }
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transaction = {
      description: description,
      price: price,
      category: category,
      date: new Date(publishDate.replace(/-/g, '/')), //replace '-' per '/' makes the date to be created in the user timezone, instead of UTC
      payment: paymentMethod,
      note: note,
      type: transactionType,
    };

    try {
      const collectionPath = `users/${user?.uid}/expenseTransactions`;
      if (user) {
        await FirebaseFirestoreService.createDocument(collectionPath, transaction);
      }
      alert('Transactions successfully added');
      resetForm();
      handleCloseButton();
      handleFetchTransactionsMonth();
      handleFetchTransactionsAll();

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        throw error;
      }
    }
  };

  const resetForm = () => {
    setDescription('');
    setPrice('');
    setCategory('');
    setPublishDate((new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    setPaymentMethod('');
    setNote('');
  };

  const handleCloseButton = () => {
    const body = document.querySelector('body');
    if(body){
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
                <h2 className={styles.addtransactionform__title}>Add a new transaction</h2>
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
                  <label htmlFor='transactionprice'>Price:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='transactionprice'
                    name='transactionprice'
                    required
                    type="number"
                    onChange={(event) => setPrice(event.target.value)}
                    value={price}
                  />
                  <label>
                    Category:
                    <select className={styles.addtransactionform__input} value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value=""></option>
                      {
                        categories && categories.length > 0
                          ? (
                            categories.map(item => (
                              <option value={item.value} key={item.id}>{item.ordering} - {item.value}</option>
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
                    onChange={(event) => setPublishDate(event.target.value)}
                    value={publishDate}
                  />
                  <label htmlFor='paymentmethod'>Payment Method:</label>
                  <input
                    className={styles.addtransactionform__input}
                    id='paymentmethod'
                    name='paymentmethod'
                    required
                    type="text"
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    value={paymentMethod}
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