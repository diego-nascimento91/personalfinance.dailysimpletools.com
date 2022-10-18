import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from 'assets/functions/validateEmail';
import { validatePassword } from 'assets/functions/validatePassword';
import { useUser } from 'assets/state/hooks/firebaseHooks';
import FirebaseAuthService from 'assets/functions/FirebaseAuthService';
import styles from './Register.module.scss';

const Register = () => {
  const [user, loading] = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [validName, setValidName] = useState(true);
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

  const handleRegisterCall = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidName(!(name === null || name === ''));

    const { isValid_email, alertMessage_email } = validateEmail(email);
    setEmailIsValid(isValid_email);
    setSpanMessageEmail(alertMessage_email);

    const { isValid_password, alertMessage_password } = validatePassword(password);
    setPasswordIsValid(isValid_password);
    setSpanMessagePassword(alertMessage_password);

    if (isValid_email && isValid_password && !(name === null || name === '')) {
      const msgErr = await FirebaseAuthService.createNewUserWithEmailAndPassword(name, email, password);
      if(msgErr != '' && msgErr != null) {
        setPasswordIsValid(false);
        if (msgErr.includes('email-already-in-use')) {
          setSpanMessagePassword('Email already in use. Return to Login page or check your information and try again.');
          return;
        }
        setSpanMessagePassword('Signup failed. Please try again later.');
        return;
      }
      alert('You have signedup!');
    }
  };

  return (
    <>
      <div className={`theme__padding ${styles.register__container}`}>
        <h1 className={styles.register__pagetitle}>Personal Finance Tool</h1>
        <div className={styles.register__block}>
          <p className={styles.register__text}>Sign-up</p>
          <form onSubmit={handleRegisterCall} noValidate>
            <label htmlFor='username' className={styles.register__label}>Name</label>
            <input
              type="name"
              id='username'
              name='username'
              placeholder='Full Name'
              required
              className={styles.register__input}
              value={name}
              onChange={(e) => { setName(e.target.value); setValidName(true); }}
            />
            {!validName && <span role='alert' className={styles.register__inputalert}>Input required! Please enter your name.</span>}
            <label htmlFor='useremail' className={styles.register__label}>E-mail</label>
            <input
              type="email"
              id='useremail'
              name='useremail'
              placeholder='youremail@domain.com'
              required
              className={styles.register__input}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailIsValid(true); }}
            />
            {!emailIsValid && <span role='alert' className={styles.register__inputalert}>{spanMessageEmail}</span>}
            <label htmlFor='userpassword' className={styles.register__label}>Password</label>
            <input
              type="password"
              id='userpassword'
              name='userpassword'
              placeholder='password'
              required
              className={styles.register__input}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordIsValid(true); }}
            />
            {!passwordIsValid && <span role='alert' className={styles.register__inputalert}>{spanMessagePassword}</span>}
            <button
              className={styles.register__button}
              type='submit'
            >Submit</button>
          </form>

          <div>
            <p className={styles.register__link}>Already have an account?&nbsp;<Link to='/'>Click here to Login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;