import Select from './Select/Select';
import Logo from './Logo/Logo';
import styles from './MenuST.module.scss';
import { useSelectedLanguage } from 'assets/state/hooks/useSelectedLanguage';

const MenuST = () => {
  const language = useSelectedLanguage();
  document.title = language.pagetitle;
  document.documentElement.setAttribute('lang', language.value);

  return(
    <header className={styles.stheader}>
      <Logo />
      <Select />
    </header>
  );
};

export default MenuST;