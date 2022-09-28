import { useEffect, useState } from 'react';
import { useUser } from 'assets/state/hooks/useUser';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import FirebaseAuthService from 'assets/functions/FirebaseAuthService';
import { validateEmail } from 'assets/functions/validateEmail';
import { validatePassword } from 'assets/functions/validatePassword';

const Login = () => {
  const [user, loading] = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [spanMessageEmail, setSpanMessageEmail] = useState('');
  const [spanMessagePassword, setSpanMessagePassword] = useState('');

  const nav = useNavigate();
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) nav('/home');
  }, [user, loading]);

  const handleLoginWithEmailCall = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { isValid_email, alertMessage_email } = validateEmail(email);
    setEmailIsValid(isValid_email);
    setSpanMessageEmail(alertMessage_email);

    const { isValid_password, alertMessage_password } = validatePassword(password);
    setPasswordIsValid(isValid_password);
    setSpanMessagePassword(alertMessage_password);

    if (isValid_email && isValid_password) {
      const err = await FirebaseAuthService.logInWithEmailAndPassword(email, password);
      if (err instanceof Error) {
        setPasswordIsValid(false);
        setSpanMessagePassword('Email/ password incorrect. Check your information and try again.');
      }
    }
  };

  const handleLoginWithGoogleCall = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    FirebaseAuthService.signInWithGoogle();
  };

  return (
    <>
      <div className={`theme__padding ${styles.login__container}`}>
        <h1 className={styles.login__pagetitle}>Personal Finance Tool</h1>
        <div className={styles.login__block}>
          <p className={styles.login__text}>Sign-in</p>
          <form onSubmit={handleLoginWithEmailCall} noValidate>
            <label htmlFor='useremail' className={`${styles.login__label} ${styles.login__labelemail}`}>E-mail</label>
            <input
              type="email"
              id='useremail'
              name='useremail'
              placeholder='youremail@domain.com'
              required
              className={`${styles.login__input} ${styles.login__inputemail}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailIsValid(true); }}
            />
            {!emailIsValid && <span role='alert' className={styles.login__inputalert}>{spanMessageEmail}</span>}
            <label htmlFor='userpassword' className={`${styles.login__label} ${styles.login__labelpassword}`}>Password</label>
            <input
              type="password"
              id='userpassword'
              name='userpassword'
              placeholder='password'
              required
              className={`${styles.login__input} ${styles.login__inputpassword}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordIsValid(true); }}
            />
            {!passwordIsValid && <span role='alert' className={styles.login__inputalert}>{spanMessagePassword}</span>}
            <button
              className={`${styles.login__button} ${styles.login__buttonemail}`}
              type='submit'
            >Login</button>
          </form>

          <button
            onClick={handleLoginWithGoogleCall}
            type='submit'
            className={`${styles.login__button} ${styles.login__buttongoogle}`}
          >Login with Google</button>
          <div>
            <Link to='/resetpassword' className={styles.login__forgotpass}>Forgot password</Link>
            <p className={styles.login__createaccount}>Don&apos;t have an account?&nbsp;<Link to='/register'>Register now</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;