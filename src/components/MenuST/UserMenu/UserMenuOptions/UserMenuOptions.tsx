import styles from './UserMenuOptions.module.scss';
import classNames from 'classnames';
import { useUserMenuStatus } from 'assets/state/hooks/useUserMenuStatus';
import FirebaseAuthService from 'assets/functions/FirebaseAuthService';

const UserMenuOptions = () => {
  const [userMenuStatus, setUserMenuStatus] = useUserMenuStatus();

  return (
    <div
      className={classNames({
        [styles.usermenuoptions]: true,
        [styles.usermenuoptions__statusmenu]: userMenuStatus
      })}
    >
      <div role='option' className={styles.usermenuoption}>
        <p className={styles.usermenuoptions__text} onClick={() => {setUserMenuStatus(false); FirebaseAuthService.signOutofAccount();}}>SignOut</p>
      </div>
      <div role='option' className={styles.usermenuoption}>
        <p className={styles.usermenuoptions__text} onClick={() => {setUserMenuStatus(false); FirebaseAuthService.deleteAccount();}}>Delete Account</p>
      </div>
    </div>
  );
};

export default UserMenuOptions;