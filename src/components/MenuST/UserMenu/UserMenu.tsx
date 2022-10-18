import { useEffect, useRef } from 'react';
import { useUser } from 'assets/state/hooks/firebaseHooks';
import { useUserMenuStatus } from 'assets/state/hooks/menuHooks';
import UserMenuOptions from './UserMenuOptions/UserMenuOptions';
import styles from './UserMenu.module.scss';

const UserMenu = () => {
  const [user] = useUser();
  const [userMenuStatus, setUserMenuStatus] = useUserMenuStatus();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        setUserMenuStatus(false);
      }
    };
    document.addEventListener('click', (event) => handleClickOutside(event));
    return () => {
      document.removeEventListener('click', (event) => handleClickOutside(event));
    };
  }, [ref]);

  return (
    <>
      {!!user && <div className={styles.usermenu__container} ref={ref}>
        <div
          className={styles.usermenu__img}
          role='select'
          onClick={() => setUserMenuStatus(!userMenuStatus)}
        >
          <p>{user.email?.charAt(0).toUpperCase()}</p>
        </div>
        <UserMenuOptions/>
      </div>}
    </>
  );
};

export default UserMenu;