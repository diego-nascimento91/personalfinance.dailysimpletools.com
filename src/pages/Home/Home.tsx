import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [type, setType] = useState('');
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

  const registerTransaction = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    // const transaction = {
    //   price: price,
    //   type: type,
    //   place: place,
    //   date: date,
    //   category: category,
    //   description: description
    // };
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
          <form>
            <label htmlFor='transactiontype'>Type:</label>
            <input type="text" name='transactiontype' id='transactiontype' value={type} onChange={(event) => setType(event?.target.value)} />
            <label htmlFor='transactionplace'>Place:</label>
            <input type="text" name='transactionplace' id='transactionplace' value={place} onChange={(event) => setPlace(event?.target.value)} />
            <label htmlFor='transactionprice'>Price:</label>
            <input type="number" name='transactionprice' id='transactionprice' value={price} onChange={(event) => setPrice(Number(event?.target.value))} />
            <label htmlFor='transactiondate'>Date:</label>
            <input type="date" name='transactiondate' id='transactiondate' value={date} onChange={(event) => setDate(event?.target.value)} />
            <label htmlFor='transactioncategory'>Category:</label>
            <input type="text" name='transactioncategory' id='transactioncategory' value={category} onChange={(event) => setCategory(event?.target.value)} />
            <label htmlFor='transactiondescription'>Description:</label>
            <textarea name='transactiondescription' id='transactiondescription' value={description} onChange={(event) => setDescription(event?.target.value)} />
            <button type='submit' onClick={registerTransaction}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;