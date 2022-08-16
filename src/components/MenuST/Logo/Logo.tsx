import logo from '../assets/simpletools.svg';
import styles from './Logo.module.scss';

const Logo = () => {


  return (
    <div className={styles.stlogo}>
      <img src={logo} alt="Simple Tools Logo" className={styles.stlogo__img} />
      <p className={styles.stlogo__txt}>simpletools</p>
    </div>
  );
};

export default Logo;