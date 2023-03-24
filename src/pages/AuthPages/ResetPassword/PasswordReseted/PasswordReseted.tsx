import { Link } from 'react-router-dom';
import styles from './PasswordReseted.module.scss';
import stylesPadding from 'styles/padding.module.scss';

const PasswordReseted = () => {
  return (
    <div className={`${styles.passwordreseted__container} ${stylesPadding.padding}`}>
      <h1 className={styles.passwordreseted__pagetitle}>Personal Finance Tool</h1>
      <div className={styles.passwordreseted__block}>
        <h2 className={styles.passwordreseted__blocktitle}>Email Link Sent</h2>
        <p className={styles.passwordreseted__text} role='alert'>If the email you provided is correct, the link to reset your password was sent to your email.<br />Check your email and follow the instructions.</p>
        <p className={styles.passwordreseted__link}><Link to='/'>Click here</Link> to return to the Login page.</p>
      </div>
    </div>
  );

};

export default PasswordReseted;