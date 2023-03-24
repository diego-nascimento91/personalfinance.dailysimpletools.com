import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validatePassword } from 'utils/validatePassword';
import { useUser } from 'state/hooks/user';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import FirebaseAuthService from 'services/FirebaseAuthService';
import styles from './Register.module.scss';
import stylesPadding from 'assets/styles/padding.module.scss';
import { validateEmail } from 'utils/validateEmail';

const Register = () => {
  const [user, loading] = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isRepeatedPasswordValid, setIsRepeatedPasswordValid] = useState(true);
  const [isRegistrationValid, setIsRegistrationValid] = useState(true);

  const [spanMessageEmail, setSpanMessageEmail] = useState('');
  const [spanMessagePassword, setSpanMessagePassword] = useState('');
  const [spanMessageFinal, setSpanMessageFinal] = useState('');
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [isRepeatedPasswordVisible, setIsRepeatedPasswordVisible] = useState(false);
  const [RepeatedPasswordInputType, setRepeatedPasswordInputType] = useState('password');

  const nav = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (user) nav('/home');
  }, [user, loading]);

  const handleRegisterFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (handleNameCheck() && handleEmailCheck() && handlePasswordCheck()) {
      handleRegisterNewUser();
    }
  };

  const handleRegisterNewUser = async () => {
    const err = await FirebaseAuthService.createNewUserWithEmailAndPassword(name, email, password);
    if (err instanceof Error) {
      setIsRegistrationValid(false);
      if ((err.message).includes('email-already-in-use')) {
        setSpanMessageFinal('Email already in use. Return to Login page or check your information and try again.');
      } else {
        setSpanMessageFinal('Signup failed. Please try again later.');
      }
      return;
    }
    alert('You have signedup!');
  };

  const handleNameCheck = () => {
    const nameValidity = !(name.trim() === null || name.trim() === '');
    setIsNameValid(nameValidity);
    return nameValidity;
  };

  const handleEmailCheck = () => {
    const { isValid_email, alertMessage_email } = validateEmail(email);
    setIsEmailValid(isValid_email);
    setSpanMessageEmail(alertMessage_email);
    return isValid_email;
  };

  const handlePasswordCheck = () => {
    // validating password
    const { isValid_password, alertMessage_password } = validatePassword(password);
    setIsPasswordValid(isValid_password);
    setSpanMessagePassword(alertMessage_password);

    // validating repeated password
    let isValid__repeatedPassword = true;
    if (isValid_password) {
      if (password !== repeatedPassword) {
        setIsRepeatedPasswordValid(false);
        setSpanMessageFinal('Passwords should be identical');
        isValid__repeatedPassword = false;
      }
    }

    return isValid_password && isValid__repeatedPassword;
  };

  const setPasswordVisibility = (whichPassword: 'password' | 'repeatedpassword') => {
    if(whichPassword === 'password') {
      if (isPasswordVisible) {
        setIsPasswordVisible(false);
        setPasswordInputType('password');
      } else {
        setIsPasswordVisible(true);
        setPasswordInputType('text');
      }
    } else if (whichPassword === 'repeatedpassword'){
      if (isRepeatedPasswordVisible) {
        setIsRepeatedPasswordVisible(false);
        setRepeatedPasswordInputType('password');
      } else {
        setIsRepeatedPasswordVisible(true);
        setRepeatedPasswordInputType('text');
      }
    }
  };

  return (
    <>
      <div className={`${stylesPadding.padding} ${styles.register__container}`}>
        <h1 className={styles.register__pagetitle}>Personal Finance Tool</h1>
        <div className={styles.register__block}>
          <p className={styles.register__text}>Sign-up</p>
          <form onSubmit={handleRegisterFormSubmit} noValidate>

            <label htmlFor='username' className={styles.register__label}>Name</label>
            <input
              type="name"
              id='username'
              name='username'
              placeholder='Full Name'
              required
              className={styles.register__input}
              value={name}
              onChange={(e) => { setName(e.target.value); setIsNameValid(true); setIsRegistrationValid(true); }}
            />
            {!isNameValid && <span role='alert' className={styles.register__inputalert}>Input required! Please enter your name.</span>}

            <label htmlFor='useremail' className={styles.register__label}>E-mail</label>
            <input
              type="email"
              id='useremail'
              name='useremail'
              placeholder='youremail@domain.com'
              required
              className={styles.register__input}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setIsEmailValid(true); setIsRegistrationValid(true); }}
            />
            {!isEmailValid && <span role='alert' className={styles.register__inputalert}>{spanMessageEmail}</span>}

            <label htmlFor='userpassword' className={styles.register__label}>Password</label>
            <div className={styles['register__passwordvisibility--container']}>
              <input
                type={passwordInputType}
                id='userpassword'
                name='userpassword'
                placeholder='Password'
                required
                className={styles.register__input}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setIsPasswordValid(true); setIsRegistrationValid(true); }}
              />
              {
                isPasswordVisible
                  ? <AiOutlineEye onClick={() => setPasswordVisibility('password')} className={styles['register__passwordvisibility--icon']} />
                  : <AiOutlineEyeInvisible onClick={() => setPasswordVisibility('password')} className={styles['register__passwordvisibility--icon']} />
              }
            </div>
            {!isPasswordValid && <span role='alert' className={styles.register__inputalert}>{spanMessagePassword}</span>}

            <label htmlFor='userrepeatpassword' className={styles.register__label}>Repeat Password</label>
            <div className={styles['register__passwordvisibility--container']}>
              <input
                type={RepeatedPasswordInputType}
                id='userrepeatpassword'
                name='userrepeatpassword'
                placeholder='Repeat Password'
                required
                className={styles.register__input}
                value={repeatedPassword}
                onChange={(e) => { setRepeatedPassword(e.target.value); setIsRepeatedPasswordValid(true); setIsRegistrationValid(true); }}
              />
              {
                isRepeatedPasswordVisible
                  ? <AiOutlineEye onClick={() => setPasswordVisibility('repeatedpassword')} className={styles['register__passwordvisibility--icon']} />
                  : <AiOutlineEyeInvisible onClick={() => setPasswordVisibility('repeatedpassword')} className={styles['register__passwordvisibility--icon']} />
              }
            </div>
            {!isRepeatedPasswordValid && <span role='alert' className={styles.register__inputalert}>{spanMessageFinal}</span>}
            {!isRegistrationValid && <span role='alert' className={styles.register__inputalert}>{spanMessageFinal}</span>}

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