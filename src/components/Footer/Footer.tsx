import styles from './Footer.module.scss';
import stylesPadding from 'assets/styles/padding.module.scss';

const Footer = () => {
  return (
    <footer className={`${stylesPadding.padding} ${styles.footer__container}`}>
      <p className={styles.footer__item}>© Copyright SimpleTools 2022</p>
      <a className={styles.footer__item} href="mailto:dailysimpletools@gmail.com">dailysimpletools@gmail.com</a>
    </footer>
  );
};

export default Footer;