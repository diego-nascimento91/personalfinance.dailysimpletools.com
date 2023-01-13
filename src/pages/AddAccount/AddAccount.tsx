import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useSelectedAccount, useUser } from 'assets/state/hooks/firebaseHooks';
import styles from './AddAccount.module.scss';
import stylesPadding from 'assets/styles/padding.module.scss';
import stylesPages from 'assets/styles/pages.module.scss';
import AddAccountForm from './AddAccountForm/AddAccountForm';
import AccountsList from './AccountsList/AccountsList';
import { handleFetchAccounts } from 'assets/functions/handleDatabaseFunctions';

const AddAccount = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [, setAccounts] = useAccounts();
  const [, setSelectedAccount] = useSelectedAccount();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if(user) handleUpdateDBs();
  }, [user]);

  useEffect(() => {
    if(user) setSelectedAccount(null);
  },[]);

  const handleUpdateDBs = () => {
    if(user) {
      handleFetchAccounts(setAccounts, user.uid);
    }
  };

  return (
    <div className={`${stylesPages.pages} ${stylesPadding.padding} ${styles.addAccount__container}`}>
      <div>
        <AddAccountForm />
        <AccountsList />
      </div>
    </div>
  );
};

export default AddAccount;