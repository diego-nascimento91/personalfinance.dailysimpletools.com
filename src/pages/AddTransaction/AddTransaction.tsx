import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccounts, useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import { handleFetchAccounts, handleFetchCategories } from 'assets/functions/handleDatabaseFunctions';
import stylesPages from 'assets/styles/pages.module.scss';
import stylesPadding from 'assets/styles/padding.module.scss';
import AddTransactionForm from './AddTransactionForm/AddTransactionForm';


const AddTransaction = () => {
  const nav = useNavigate();
  const [user, loading] = useUser();
  const [categories, setCategories] = useCategories();
  const [accounts, setAccounts] = useAccounts();


  useEffect(() => {
    if (loading) return;
    if (!user) nav('/');
    if (user) {
      handleUpdateDBs();
    }
  }, [user]);

  const handleUpdateDBs = () => {
    if (user) {
      if (!(categories && categories.length > 0)) {
        handleFetchCategories(setCategories, user.uid);
      }
      if (!(accounts && accounts.length > 0)) {
        handleFetchAccounts(setAccounts, user.uid);
      }
    }
  };

  return (
    <div className={`${stylesPadding.padding} ${stylesPages.pages}`}>
      <AddTransactionForm />
    </div>
  );
};

export default AddTransaction;