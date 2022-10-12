import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ICategory } from 'assets/interfaces/interfaces';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import styles from './AddTransaction.module.scss';

const AddTransaction = ({ handleFetchTransactions }:{ handleFetchTransactions: () => void }) => {
  const [user,] = useUser();
  const [transactionType, setTransactionType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [place, setPlace] = useState('');
  const [price, setPrice] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<ICategory[]>();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user) {
      FirebaseFirestoreService.readAllDocsFromCollection('basicCategories')
        .then(response => {
          setCategories(response as ICategory[]);
        })
        .catch(error => {
          if (error instanceof Error) {
            alert(`Error Fetching Categories: ${error.message}`);
            throw error;
          }
        });
    }
  }, [user]);

  const resetForm = () => {
    setTransactionType('');
    setPaymentMethod('');
    setPlace('');
    setPrice('');
    setPublishDate(new Date().toISOString().split('T')[0]);
    setCategory('');
    setDescription('');
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transaction = {
      type: transactionType,
      payment: paymentMethod,
      place: place,
      price: price,
      date: new Date(publishDate.replace(/-/g, '/')), //replace '-' per '/' makes the date to be created in the user timezone, instead of UTC
      category: category,
      description: description
    };

    try {
      const collectionPath = `users/${user?.uid}/transactions`;
      if (user) {
        await FirebaseFirestoreService.createDocument(collectionPath, transaction);
      }
      alert('Transactions successfully added');
      resetForm();
      handleFetchTransactions();

    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        alert(error.message);
      }
    }
  };

  return (
    <section className={`${styles.addtransaction__container} theme__homesections`}>
      <h2 className={styles.addtransaction__title}>Add a new transaction</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor='transactiontype'>Type:</label>
        <select
          name="transactiontype"
          id="transactiontype"
          required
          className={styles.addtransaction__input}
          value={transactionType}
          onChange={(event) => setTransactionType(event.target.value)}
        >
          <option value=""></option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <label htmlFor='paymentmethod'>Payment Method:</label>
        <input
          className={styles.addtransaction__input}
          id='paymentmethod'
          name='paymentmethod'
          required
          type="text"
          onChange={(event) => setPaymentMethod(event.target.value)}
          value={paymentMethod}
        />
        <label htmlFor='transactionplace'>Place:</label>
        <input
          className={styles.addtransaction__input}
          id='transactionplace'
          name='transactionplace'
          required
          type="text"
          onChange={(event) => setPlace(event.target.value)}
          value={place}
        />
        <label htmlFor='transactionprice'>Price:</label>
        <input
          className={styles.addtransaction__input}
          id='transactionprice'
          name='transactionprice'
          required
          type="number"
          onChange={(event) => setPrice(event.target.value)}
          value={price}
        />
        <label htmlFor='transactiondate'>Date:</label>
        <input
          className={styles.addtransaction__input}
          id='transactiondate'
          name='transactiondate'
          required
          type="date"
          onChange={(event) => setPublishDate(event.target.value)}
          value={publishDate}
        />
        <label>
          Category:
          <select className={styles.addtransaction__input} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value=""></option>
            {
              categories && categories.length > 0
                ? (
                  categories.map(cat => (
                    <option value={cat.id} key={cat.id}>{cat.value}</option>
                  ))
                )
                : null
            }
          </select>
        </label>
        <label htmlFor='transactiondescription'>Description:</label>
        <textarea
          className={styles.addtransaction__textarea}
          id='transactiondescription'
          name='transactiondescription'
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
        <button className={styles.addtransaction__button} type='submit'>Add Transaction</button>
      </form>
    </section>
  );
};

export default AddTransaction;