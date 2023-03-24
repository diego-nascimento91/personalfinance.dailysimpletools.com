import { IAccount } from 'utils/interfaces';
import { useSelectedAccount_toBeEdited } from 'state/hooks/accounts';
import { useUser } from 'state/hooks/user';
import styles from './AccountItem.module.scss';
import { useDeleteAccount } from 'state/reducers/accounts';

interface Props {
  account: IAccount
}
const AccountItem = (props: Props) => {
  const { account } = props;
  
  const [user] = useUser();
  const [, setSelectedAccount] = useSelectedAccount_toBeEdited();
  const deleteAccount = useDeleteAccount();

  const handleEditButtonClick = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    setSelectedAccount({ ...account });
  };

  const handleDeleteButtonClick = async () => {
    if (user) {
      deleteAccount(account);
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