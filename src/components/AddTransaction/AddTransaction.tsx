import { fetchTransactions } from 'assets/functions/fetchTransactions';
import FirebaseFirestoreService from 'assets/functions/FirebaseFirestoreService';
import { ITransaction } from 'assets/interfaces/interfaces';
import { useTransactions } from 'assets/state/hooks/useTransactions';
import { useUser } from 'assets/state/hooks/useUser';
import { useState } from 'react';
import styles from './AddTransaction.module.scss';

const AddTransaction = () => {
  const [user,] = useUser();
  const [, setTransactions] = useTransactions();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [place, setPlace] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setPaymentMethod('');
    setPlace('');
    setPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('');
    setDescription('');
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transaction: ITransaction = {
      payment: paymentMethod,
      place: place,
      price: price,
      date: new Date(date),
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
      fetchTransactions(collectionPath, setTransactions);

    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        alert(error.message);
      }
    }
  };

  return (
    <div className={styles.addtransaction__container}>
      <h2 className={styles.addtransaction__title}>Add a new transaction</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor='transactiontype'>Payment Method:</label>
        <input
          className={styles.addtransaction__input}
          id='transactiontype'
          name='transactiontype'
          required
          type="text"
          onChange={(event) => setPaymentMethod(event?.target.value)}
          value={paymentMethod}
        />
        <label htmlFor='transactionplace'>Place:</label>
        <input
          className={styles.addtransaction__input}
          id='transactionplace'
          name='transactionplace'
          required
          type="text"
          onChange={(event) => setPlace(event?.target.value)}
          value={place}
        />
        <label htmlFor='transactionprice'>Price:</label>
        <input
          className={styles.addtransaction__input}
          id='transactionprice'
          name='transactionprice'
          required
          type="number"
          onChange={(event) => setPrice(event?.target.value)}
          value={price}
        />
        <label htmlFor='transactiondate'>Date:</label>
        <input
          className={styles.addtransaction__input}
          id='transactiondate'
          name='transactiondate'
          required
          type="date"
          onChange={(event) => setDate(event?.target.value)}
          value={date}
        />
        <label htmlFor='transactioncategory'>Category:</label>
        <input
          className={styles.addtransaction__input}
          id='transactioncategory'
          name='transactioncategory'
          required
          type="text"
          onChange={(event) => setCategory(event?.target.value)}
          value={category}
        />
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
    </div>
  );
};

export default AddTransaction;