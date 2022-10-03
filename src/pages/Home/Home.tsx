import { useUser } from 'assets/state/hooks/useUser';
import AddTransaction from 'components/AddTransaction/AddTransaction';
import Transactions from 'components/Transactions/Transactions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
  }, [user, loading]);

  return (
    <div className='theme__padding'>
      <section className={`${styles.loggedin__container} theme__homesections`}>
        <p>Welcome {user?.email}!</p>
      </section>
      <Transactions />
      <AddTransaction />
    </div>
  );
};

export default Home;