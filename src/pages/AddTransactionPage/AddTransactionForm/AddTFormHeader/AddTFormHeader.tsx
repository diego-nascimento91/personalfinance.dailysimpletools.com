import { useSelectedTransaction_toBeEdited } from 'state/hooks/transactions';
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { returnPage } from 'utils/returnPage';
import styles from './AddTFormHeader.module.scss';

interface Props {
  title: string,
}

const AddTFormHeader = (props: Props) => {
  const {title} = props;

  const nav = useNavigate();
  const [,setCurrentTransaction] = useSelectedTransaction_toBeEdited();

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