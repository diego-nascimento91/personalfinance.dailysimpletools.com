import { useSelectedLanguage } from 'state/hooks/navbar';
import Language from './Language/Language';
import Logo from './Logo/Logo';
import UserMenu from './UserMenu/UserMenu';
import styles from './MenuST.module.scss';
import stylesPadding from 'styles/padding.module.scss';

const MenuST = () => {
  const language = useSelectedLanguage();
  
  document.title = language.pagetitle;
  document.documentElement.setAttribute('lang', language.value);

  return (
    <header className={`${stylesPadding.padding} ${styles.stheader}`}>
      <Logo />
      <div className={styles.stheader__nav}>
        <Language />
        <UserMenu />
      </div>
    </header>
  );
};

export default MenuST;