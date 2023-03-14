import styles from './AddAccount.module.scss';
import AddAccountForm from './AddAccountForm/AddAccountForm';
import AccountsList from './AccountsList/AccountsList';
import PageWrapperLoggedIn from 'components/PageWrapperLoggedIn/PageWrapperLoggedIn';

const AddAccount = () => {

  return (
    <PageWrapperLoggedIn customStyles={styles.addAccount__container}>
      <AddAccountForm />
      <AccountsList />
    </PageWrapperLoggedIn>
  );
};

export default AddAccount;