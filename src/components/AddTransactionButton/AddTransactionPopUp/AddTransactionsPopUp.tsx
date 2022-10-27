import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useCurrentTransaction, useShowChooseTypeTransactionPopUp } from 'assets/state/hooks/addTransactionHooks';
import { useNavigate } from 'react-router-dom';
import styles from './AddTransactionPopUp.module.scss';


const AddTransactionPopUp = () => {
  const nav = useNavigate();
  const [showPopUp, setShowPopUp] = useShowChooseTypeTransactionPopUp();
  const [,setCurrentTransaction] = useCurrentTransaction();

  const handleNewTransactionButtonClick = () => {
    setShowPopUp(false);
    setCurrentTransaction(null);
    nav('/newtransaction');
  };

  const handleNewCategoryButtonClick = () => {
    setShowPopUp(false);
    nav('/newcategory');
  };

  return (
    <>
      {
        showPopUp
          ? (
            <div className={styles.popup__container} >
              <div role='button' onClick={() => handleNewTransactionButtonClick()} className={styles.popup__option}>
                <AiOutlinePlusCircle className={styles['popup__option--icon']}/>
                <span className={styles['popup__option--text']}>New transaction</span>
              </div>
              <div role='button' onClick={() => handleNewCategoryButtonClick()} className={styles.popup__option}>
                <AiOutlinePlusCircle className={styles['popup__option--icon']}/>
                <span className={styles['popup__option--text']}>New category</span>
              </div>
            </div >
          )
          : null
      }
    </>
  );
};

export default AddTransactionPopUp;