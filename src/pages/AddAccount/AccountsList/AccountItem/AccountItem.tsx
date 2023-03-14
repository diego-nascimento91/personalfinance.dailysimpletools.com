import { handleDeleteDocFunction, handleFetchAccounts } from 'assets/functions/handleDatabaseFunctions';
import { IAccount } from 'assets/interfaces/interfaces';
import { useAccounts, useSelectedAccount } from 'assets/state/hooks/accounts';
import { useUser } from 'assets/state/hooks/user';
import styles from './AccountItem.module.scss';

interface Props {
  account: IAccount
}
const AccountItem = (props: Props) => {
  const { account } = props;

  const [user] = useUser();
  const [, setAccounts] = useAccounts();
  const [, setSelectedAccount] = useSelectedAccount();

  const handleEditButtonClick = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setSelectedAccount({ ...account });
  };

  const handleDeleteButtonClick = async () => {
    if (user) {
      await handleDeleteDocFunction('accounts', user.uid, account);

      handleFetchAccounts(setAccounts, user.uid);
    }
  };

  return (
    <div className={styles.userAccount__container}>
      <div className={styles['userAccount__nameAndType--container']}>
        <p className={styles['userAccount__nameAndType--name']}>{account.name}</p>
        <p className={styles['userAccount__nameAndType--type']}>Type: {account.type}</p>
        {
          account.type === 'balance-account'
            ? <p className={styles['userAccount__nameAndType--type']}>Balance: $ {account.balance.toFixed(2)}</p>
            : null
        }
      </div>
      <div className={styles.userAccount__buttons}>
        <button className={styles.userAccount__button} role='button' onClick={handleEditButtonClick}>edit</button>
        <button className={styles.userAccount__button} role='button' onClick={handleDeleteButtonClick}>delete</button>
      </div>
    </div>
  );
};

export default AccountItem;