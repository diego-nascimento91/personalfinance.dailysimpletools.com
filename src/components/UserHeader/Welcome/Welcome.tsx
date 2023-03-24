import 'react-datepicker/dist/react-datepicker.css';
import { useUser } from 'state/hooks/user';
import styles from './Welcome.module.scss';


const Welcome = () => {

  const [user,] = useUser();

  return (
    <div>
      {
        user
          ? (
            <div>
              <p className={styles.welcome__text}>Welcome {user.email}!</p>
            </div>
          )
          : null
      }
    </div>
  );
};

export default Welcome;