import styles from './UserMenuOptions.module.scss';
import classNames from 'classnames';
import { useUserMenuStatus } from 'assets/state/hooks/useUserMenuStatus';
import { deleteAccount, signOutofAccount } from 'assets/firebaseAuth';

const UserMenuOptions = () => {
  const [userMenuStatus, ] = useUserMenuStatus();

  return (
    <div
      className={classNames({
        [styles.usermenuoptions]: true,
        [styles.usermenuoptions__statusmenu]: userMenuStatus
      })}
    >
      <div role='option' className={styles.usermenuoption}>
        <p className={styles.usermenuoptions__text} onClick={signOutofAccount}>SignOut</p>
      </div>
      <div role='option' className={styles.usermenuoption}>
        <p className={styles.usermenuoptions__text} onClick={deleteAccount}>Delete Account</p>
      </div>
    </div>
  );
};

export default UserMenuOptions;