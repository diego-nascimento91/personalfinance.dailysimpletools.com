import { useUser } from 'assets/state/hooks/useUser';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Welcome.module.scss';


const Welcome = () => {

  const [user,] = useUser();

  return (
    <section>
      {
        user
          ? (
            <div>
              <p className={styles.welcome__text}>Welcome {user.email}!</p>
            </div>
          )
          : null
      }
    </section>
  );
};

export default Welcome;