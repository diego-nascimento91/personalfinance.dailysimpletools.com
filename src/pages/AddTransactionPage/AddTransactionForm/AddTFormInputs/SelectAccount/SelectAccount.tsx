import { memo } from 'react';
import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { useAccounts } from 'assets/state/hooks/firebaseHooks';
import { useNavigate } from 'react-router-dom';
import styles from './SelectAccount.module.scss';

interface Props {
  account: string,
  accountID: string,
  error?: {
    message: string,
    status: boolean,
  },
  label: string,
  setAccount: (account: string) => void,
}
const SelectAccount = (props: Props) => {
  const { account, accountID, error, label, setAccount } = props;
  const nav = useNavigate();
  const [accounts] = useAccounts();
  const [currentTransaction] = useCurrentTransaction();

  const handleSetAccount = (value: string) => {
    if (value === 'addaccount') {
      nav('/newaccount');
      return;
    }

    setAccount(value);
  };

  const accountExists = () => {
    // the accountID is used here instead of the currentTransaction.account.id because of the case of a transfer transaction, where there as 2 IDs.
    if (currentTransaction && !(accounts.map(item => (item.id)).includes(accountID)) && account === '') {
      return false; // account === '' is to change this condition in case user selects another account
    }
    return true;
  };

  return (
    <label className={styles.selectAccount}>
      {label}

      <select className={styles.selectAccount__select} value={account} onChange={(e) => handleSetAccount(e.target.value)} required>
        <option value="" disabled></option>
        {
          accounts && accounts.length > 0 &&
          (accounts.map(item => (
            <option value={JSON.stringify(item)} key={item.id}>{item.name}</option>
          )))
        }
        <option value="" disabled>...</option>
        <option value="addaccount">Add new account</option>
      </select>

      {!accountExists() && currentTransaction && (
        <span role='alert' className={styles.selectAccount__accountAlert}>
          The account linked to this transaction has been deleted. To update this transaction, you have to choose another account. Note that this transaction&apos;s amount will be added to the balance of the new account chosen.
        </span>
      )}
      { error && error.status && account !== '' && 
        <span role='alert' className={styles.selectAccount__accountAlert}>{error.message}</span> 
      }
    </label>
  );
};

export default memo(SelectAccount) ;