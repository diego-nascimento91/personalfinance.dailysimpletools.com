import { returnPage } from 'assets/functions/returnPage';
import { ITransactionType } from 'assets/interfaces/interfaces';
import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import styles from './AddTFormHeader.module.scss';

interface Props {
  transactionType: ITransactionType | null,
}

const AddTFormHeader = (props: Props) => {
  const {transactionType} = props;

  const nav = useNavigate();
  const [currentTransaction, setCurrentTransaction] = useCurrentTransaction();

  const getFormTitle = () => {
    if (currentTransaction) return 'Update Transaction';
    if (transactionType === 'income') return 'Add a new Income';
    if (transactionType === 'expense') return 'Add a new Expense';
    return 'Add a new Transaction';
  };

  const handleReturnButton = () => {
    setCurrentTransaction(null);
    returnPage(nav);
  };

  return (
    <>
      <BsArrowLeft
        className={styles.addTFormHeader__returnPage}
        role='button'
        onClick={handleReturnButton}
      />
      <h2>{getFormTitle()}</h2>
    </>
  );
};

export default AddTFormHeader;