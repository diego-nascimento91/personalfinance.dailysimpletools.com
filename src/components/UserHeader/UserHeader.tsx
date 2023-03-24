import DatePicker from './DatePicker/DatePicker';
import NavBar from './NavBar/NavBar';
import styles from './UserHeader.module.scss';
import stylesComponents from 'styles/pageComponents.module.scss';
import Welcome from './Welcome/Welcome';

const UserHeader = () => {
  return (
    <section className={`${styles.userheader__container} ${stylesComponents.pageComponents}`}>
      <Welcome />
      <div className={styles.userheader__nav}>
        <NavBar />
        <DatePicker />
      </div>
    </section>
  );
};

export default UserHeader;