import { useUser } from 'assets/state/hooks/useUser';

const Welcome = () => {
  const [user,] = useUser();
  return (
    <section className='theme__homesections'>
      <p>Welcome {user?.email}!</p>
    </section>
  );
};

export default Welcome;