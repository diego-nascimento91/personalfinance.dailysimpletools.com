import { useEffect, useState } from 'react';
import { useUser } from 'assets/state/hooks/useUser';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.scss';
import { validateEmail } from 'assets/functions/validateEmail';
import { sendPasswordReset } from 'assets/functions/firebase/authPasswordReset';

const ResetPassword = () => {
  const [user, loading] = useUser();
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [spanMessageEmail, setSpanMessageEmail] = useState('');

  const nav = useNavigate();
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) nav('/home');
  }, [user, loading]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { isValid_email, alertMessage_email } = validateEmail(email);
    setEmailIsValid(isValid_email);
    setSpanMessageEmail(alertMessage_email);

    if (isValid_email) {
      await sendPasswordReset(email);
      nav('/resetpassword/emailsent');
    }
  };

  return (
    <>
      <div className={`theme__padding ${styles.resetpassword__container}`}>
        <h1 className={styles.resetpassword__pagetitle}>Personal Finance Tool</h1>
        <div className={styles.resetpassword__block}>
          <h2 className={styles.resetpassword__text}>Reset Password!</h2>
          <form onSubmit={handleResetPassword} noValidate>
            <label htmlFor='useremail' className={`${styles.resetpassword__label} ${styles.resetpassword__labelemail}`}>E-mail</label>
            <input
              type="email"
              id='useremail'
              name='useremail'
              placeholder='youremail@domain.com'
              required
              className={`${styles.resetpassword__input} ${styles.resetpassword__inputemail}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailIsValid(true); }}
            />
            {!emailIsValid && <span role='alert' className={styles.resetpassword__inputalert}>{spanMessageEmail}</span>}
            <button
              className={`${styles.resetpassword__button} ${styles.resetpassword__button}`}
              type='submit'
              role='submit'
            >Submit</button>
          </form>
          <div>
            <p className={styles.resetpassword__login}>Already have an account?&nbsp;<Link to='/'>Click here to Login</Link></p>
            <p className={styles.resetpassword__createaccount}>Don&apos;t have an account?&nbsp;<Link to='/register'>Register now</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;