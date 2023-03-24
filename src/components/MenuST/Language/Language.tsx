import { useEffect, useRef } from 'react';
import { FaGlobeAmericas } from 'react-icons/fa';
import { useMenuStatus, useSelectedLanguage } from 'state/hooks/navbar';
import LanguageOptions from './LanguageOptions/LanguageOptions';
import styles from './Language.module.scss';

const Language = () => {

  const selectedLanguage = useSelectedLanguage();
  const [statusMenu, setStatusMenu] = useMenuStatus();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        setStatusMenu(false);
      }
    };
    document.addEventListener('click', (event) => handleClickOutside(event));
    return () => {
      document.removeEventListener('click', (event) => handleClickOutside(event));
    };
  }, [ref]);

  return (
    <div className={styles.weblanguage__container} ref={ref}>
      <div
        role='select'
        className={styles.weblanguage__selectedlanguage}
        onClick={() => setStatusMenu(!statusMenu)}
      >
        <FaGlobeAmericas className={styles.weblanguage__globeicon}/>
        <p className={styles.weblanguage__languagetext}>{`${selectedLanguage.label}`}</p>
      </div>
      <LanguageOptions />
    </div>
  );
};

export default Language;