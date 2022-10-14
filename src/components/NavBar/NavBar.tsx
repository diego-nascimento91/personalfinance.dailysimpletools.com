import { Link } from 'react-router-dom';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <section>
      <nav>
        <ul className={styles.navbar__menu}>
          <li className={styles.navbar__item}><Link to='/home'>Home</Link></li>
          <li className={styles.navbar__item}><Link to='/transactions'>Transactions</Link></li>
        </ul>
      </nav>
    </section>
  );
};

export default NavBar;