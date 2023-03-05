import { returnPage } from 'assets/functions/returnPage';
import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import styles from './AddTFormHeader.module.scss';

interface Props {
  title: string,
}

const AddTFormHeader = (props: Props) => {
  const {title} = props;

  const nav = useNavigate();
  const [,setCurrentTransaction] = useCurrentTransaction();

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
      <h2>{title}</h2>
    </>
  );
};

export default AddTFormHeader;