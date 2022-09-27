import { updateTransaction } from 'assets/functions/firebase/firestoreUpdateTransaction';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [place, setPlace] = useState('');
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) nav('/');
  }, [user, loading]);

  const registerTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transaction = {
      paymentMethod: paymentMethod,
      place: place,
      price: price,
      date: date,
      category: category,
      description: description
    };
    await updateTransaction(transaction, 1);
  };

  return (
    <div>
      <div className={styles.loggedin__container}>
        <p>Welcome {user?.displayName}! You are now signed-in!</p>
        <p>This is your data:</p>
        <ul>
          <li>Name: {user?.displayName}</li>
          <li>Email: {user?.email}</li>
          <li>ID: {user?.uid}</li>
        </ul>
        <div className={styles.addtransaction}>
          <h2>Fill in the form to register a new transaction</h2>
          <form onSubmit={registerTransaction}>
            <label htmlFor='transactiontype'>Payment Method:</label>
            <input 
              id='transactiontype' 
              name='transactiontype' 
              required
              type="text" 
              onChange={(event) => setPaymentMethod(event?.target.value)} 
              value={paymentMethod} 
            />
            <label htmlFor='transactionplace'>Place:</label>
            <input 
              id='transactionplace' 
              name='transactionplace' 
              required
              type="text" 
              onChange={(event) => setPlace(event?.target.value)}
              value={place} 
            />
            <label htmlFor='transactionprice'>Price:</label>
            <input 
              id='transactionprice' 
              name='transactionprice'
              required
              type="number" 
              onChange={(event) => setPrice(Number(event?.target.value))} 
              value={price} 
            />
            <label htmlFor='transactiondate'>Date:</label>
            <input 
              id='transactiondate' 
              name='transactiondate' 
              required
              type="date" 
              onChange={(event) => setDate(event?.target.value)} 
              value={date} 
            />
            <label htmlFor='transactioncategory'>Category:</label>
            <input 
              id='transactioncategory' 
              name='transactioncategory' 
              required
              type="text" 
              onChange={(event) => setCategory(event?.target.value)} 
              value={category} 
            />
            <label htmlFor='transactiondescription'>Description:</label>
            <textarea 
              id='transactiondescription' 
              name='transactiondescription' 
              onChange={(event) => setDescription(event?.target.value)} 
              value={description} 
            />
            <button type='submit'>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;