import { useLanguages, useMenuStatus, useSetSelectedLanguage } from 'assets/state/hooks/menuHooks';
import classNames from 'classnames';
import styles from './LanguageOptions.module.scss';

export default function LanguageOptions() {
  const [menuStatus, setMenuStatus] = useMenuStatus();
  const setSelectedLanguage = useSetSelectedLanguage();
  const languages = useLanguages();

  const selectLanguage = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    setMenuStatus(false);
  };

  return (
    <div 
      className={classNames({
        [styles.languageoptions]: true,
        [styles.languageoptions__statusmenu]: menuStatus
      })}
    >
      {languages.map(language => (
        <div
          role='option'
          key={language.value}
          className={styles.languageoption}
          onClick={() => selectLanguage(language)}
        >
          <p className={styles.languageoptions__text}>{language.label}</p>
        </div>
      ))}
    </div>
  );
}