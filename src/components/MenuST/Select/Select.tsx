import styles from './Select.module.scss';
import { useEffect, useRef} from 'react';
import { LanguageOptions } from './LanguageOptions/LanguageOptions';
import { useSelectedLanguage } from 'assets/state/hooks/useSelectedLanguage';
import { useMenuStatus } from 'assets/state/hooks/useMenuStatus';

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
        <img
          src={selectedLanguage.image}
          alt={`${selectedLanguage.label} Language`}
          className={styles.weblanguage__img}
        />
      </div>  
      <LanguageOptions />
    </div>
  );
};

export default Language;