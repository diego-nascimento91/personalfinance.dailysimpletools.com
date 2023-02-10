import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { useAccounts } from 'assets/state/hooks/firebaseHooks';
import { useNavigate } from 'react-router-dom';
import { SetterOrUpdater } from 'recoil';
import styles from './SelectInput.module.scss';

interface Props {
  account: string,
  setAccount: SetterOrUpdater<string>,
  label: string
}
const SelectInput = (props: Props) => {
  const { account, setAccount, label } = props;
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

  return (
    <label className={styles.SelectInput__container}>
      {label}

      <select
        className={styles.SelectInput__select}
        value={account}
        onChange={(e) => handleSetAccount(e.target.value)}
        required
      >
        <option value=""></option>
        {
          accounts && accounts.length > 0
            ? (accounts.map(item => (
              <option value={JSON.stringify(item)} key={item.id}>{item.name}</option>
            )))
            : null
        }
        <option value="" disabled></option>
        <option value="addaccount">{'>'} Add a new account</option>
      </select>
      {
        currentTransaction && !(accounts.map(item => (item.id)).includes(currentTransaction.account.id))
          ? (
            <div role='alert' className={styles.SelectInput__accountDeletedAlert}>
              The account linked to this transaction has been deleted. To update this transaction, you have to choose another account. Note that this transaction&apos;s amount will be added to the balance of the new account chosen.
            </div>
          )
          : null
      }
    </label>
  );
};

export default SelectInput;