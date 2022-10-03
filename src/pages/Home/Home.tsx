import { useUser } from 'assets/state/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTransaction from './AddTransaction/AddTransaction';
import Transactions from './Transactions/Transactions';
import Welcome from './Welcome/Welcome';

const Home = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
  }, [user, loading]);

  return (
    <div className='theme__padding'>
      <Welcome />
      <Transactions />
      <AddTransaction />
    </div>
  );
};

export default Home;