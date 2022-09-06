import styles from './LanguageOptions.module.scss';
import classNames from 'classnames';
import { useMenuStatus } from 'assets/state/hooks/useLanguageMenuStatus';
import { useLanguages } from 'assets/state/hooks/useLanguages';
import { useSetSelectedLanguage } from 'assets/state/hooks/useSetSelectedLanguage';

export function LanguageOptions() {
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