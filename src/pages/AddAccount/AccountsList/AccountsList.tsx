import styles from './AccountsList.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import AccountItem from './AccountItem/AccountItem';
import { useAccounts } from 'state/hooks/accounts';


const AccountsList = () => {
  const [accounts] = useAccounts();

  return (
    <section className={`${stylesComponents.pageComponents} ${styles.userAccounts__container}`}>
      <h2>Accounts Added</h2>
      <div className={styles.userAccounts__userAccountComponents}>
        {
          accounts && accounts.length > 0
            ? (
              accounts.map(account => (
                <AccountItem key={account.id} account={account} />
              ))
            )
            : 'No accounts added yet.'
        }
      </div>
    </section>
  );
};

export default AccountsList;
