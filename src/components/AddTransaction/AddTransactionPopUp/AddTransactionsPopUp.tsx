import { useShowAddForm, useShowPopUp, useChosenType } from 'assets/state/hooks/addTransactionHooks';
import styles from './AddTransactionPopUp.module.scss';


const AddTransactionPopUp = () => {
  const [showPopUp, setShowPopUp] = useShowPopUp();
  const [, setChosenType] = useChosenType();
  const [, setShowAddForm] = useShowAddForm();

  const handleIncomeClick = () => {
    setOverflowHidden();
    setShowPopUp(false);
    setChosenType('income');
    setShowAddForm(true);
  };
  const handleExpenseClick = () => {
    setOverflowHidden();
    setShowPopUp(false);
    setChosenType('expense');
    setShowAddForm(true);
  };
  const setOverflowHidden = () => {
    const body = document.querySelector('body');
    if(body){
      body.style.overflow = 'hidden';
    }
  };

  return (
    <>
      {
        showPopUp
          ? (
            <div className={styles.popup__container} >
              <h2 className={`theme__title ${styles.popup__title}`}>Type of transaction</h2>
              <button
                type='button'
                className={styles.popup__option}
                onClick={handleIncomeClick}
              >Income</button>
              <button
                type='button'
                className={styles.popup__option}
                onClick={handleExpenseClick}
              >Expense</button>
            </div >
          )
          : null
      }
    </>
  );
};

export default AddTransactionPopUp;