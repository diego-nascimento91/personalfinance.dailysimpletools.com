import AddTransactionForm from './AddTransactionForm/AddTransactionForm';
import PageWrapperLoggedIn from 'components/PageWrapperLoggedIn/PageWrapperLoggedIn';


const AddTransaction = () => {

  return (
    <PageWrapperLoggedIn>
      <AddTransactionForm />
    </PageWrapperLoggedIn>
  );
};

export default AddTransaction;