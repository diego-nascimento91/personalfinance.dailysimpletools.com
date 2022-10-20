import { Link } from 'react-router-dom';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <div className='theme__navbar'>
      <nav>
        <ul className={styles.navbar__menu}>
          <li className={styles.navbar__item}><Link to='/home'>Home</Link></li>
          <li className={styles.navbar__item}><Link to='/transactions'>Transactions</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;