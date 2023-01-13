import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useCurrentTransaction, useShowChooseTypeTransactionPopUp } from 'assets/state/hooks/addTransactionHooks';
import { useNavigate } from 'react-router-dom';
import styles from './AddPlusButtonPopUp.module.scss';


const AddPlusButtonPopUp = () => {
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

  const handleNewAccountButtonClick = () => {
    setShowPopUp(false);
    nav('/newaccount');
  };

  return (
    <>
      {
        showPopUp
          ? (
            <div className={styles.popup__container} >
              <div role='button' onClick={() => handleNewTransactionButtonClick()} className={styles.popup__option}>
                <AiOutlinePlusCircle className={styles['popup__option--icon']}/>
                <span className={styles['popup__option--text']}>Add a new transaction</span>
              </div>
              <div role='button' onClick={() => handleNewCategoryButtonClick()} className={styles.popup__option}>
                <AiOutlinePlusCircle className={styles['popup__option--icon']}/>
                <span className={styles['popup__option--text']}>Add/Edit a category</span>
              </div>
              <div role='button' onClick={() => handleNewAccountButtonClick()} className={styles.popup__option}>
                <AiOutlinePlusCircle className={styles['popup__option--icon']}/>
                <span className={styles['popup__option--text']}>Add/Edit an account</span>
              </div>
            </div >
          )
          : null
      }
    </>
  );
};

export default AddPlusButtonPopUp;