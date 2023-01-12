import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'assets/state/hooks/firebaseHooks';
// import { handleFetchOnlyUserCategories } from 'assets/functions/handleDatabaseFunctions';
// import { useSelectedCategory, useUserCategories } from 'assets/state/hooks/addCategoryHooks';
import styles from './AddAccount.module.scss';
import stylesPadding from 'assets/styles/padding.module.scss';
import stylesPages from 'assets/styles/pages.module.scss';
import AddAccountForm from './AddAccountForm/AddAccountForm';
// import AccountsList from './AccountsList/AccountsList';

const AddAccount = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  // const [, setUserCategories] = useUserCategories();
  // const [, setSelectedCategory] = useSelectedCategory();

  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if(user) handleUpdateDBs();
  }, [user]);

  // useEffect(() => {
  //   if(user) setSelectedCategory(null);
  // },[]);

  const handleUpdateDBs = () => {
    if(user) {
      // handleFetchOnlyUserCategories(setUserCategories, user.uid);
    }
  };

  return (
    <div className={`${stylesPages.pages} ${stylesPadding.padding} ${styles.addAccountPage__container}`}>
      <div>
        <AddAccountForm />
        {/* <AccountsList /> */}
      </div>
    </div>
  );
};

export default AddAccount;