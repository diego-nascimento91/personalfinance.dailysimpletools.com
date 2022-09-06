import Select from './Select/Select';
import Logo from './Logo/Logo';
import styles from './MenuST.module.scss';
import { useSelectedLanguage } from 'assets/state/hooks/useSelectedLanguage';
import UserMenu from './UserMenu/UserMenu';

const MenuST = () => {
  const language = useSelectedLanguage();
  
  document.title = language.pagetitle;
  document.documentElement.setAttribute('lang', language.value);

  return (
    <header className={`theme__padding ${styles.stheader}`}>
      <Logo />
      <div className={styles.stheader__nav}>
        <Select />
        <UserMenu />
      </div>
    </header>
  );
};

export default MenuST;