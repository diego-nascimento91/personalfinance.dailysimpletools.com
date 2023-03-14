import { useUserMenuStatus } from 'assets/state/hooks/navbar';
import FirebaseAuthService from 'assets/functions/FirebaseAuthService';
import styles from './UserMenuOptions.module.scss';

const UserMenuOptions = () => {
  const [userMenuStatus, setUserMenuStatus] = useUserMenuStatus();

  const handleSightOutClick = () => {
    setUserMenuStatus(false);
    FirebaseAuthService.signOutofAccount();
    window.location.reload(); 
  };

  const handleDeleteUserClick = () => {
    try {
      const deleteConfirmation = window.confirm('Are you sure you want to delete your account?\nThis action will erase all your data and it cannot be undone.\n Ok for Yes. Cancel for No.');
      if (deleteConfirmation) {
        setUserMenuStatus(false);
        FirebaseAuthService.deleteAccount();
        window.location.reload();
      } else {
        throw new Error('User deletion cancelled.');
      }
    } catch (error) {
      if(error instanceof Error){
        alert(error.message);
        throw error;
      }
    }
  };

  return (
    <>
      {
        userMenuStatus
          ? (
            <div className={styles.usermenuoptions}>
              <div role='option' className={styles.usermenuoption}>
                <p className={styles.usermenuoptions__text} onClick={handleSightOutClick}>SignOut</p>
              </div>
              <div role='option' className={styles.usermenuoption}>
                <p className={styles.usermenuoptions__text} onClick={handleDeleteUserClick}>Delete Account</p>
              </div>
            </div>
          )
          : null
      }
    </>
  );
};

export default UserMenuOptions;