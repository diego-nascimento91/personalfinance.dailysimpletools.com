import { useEffect, useRef } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useShowChooseTypeTransactionPopUp, useShowReceiptPopUp } from 'assets/state/hooks/addTransactionHooks';
import classNames from 'classnames';
import styles from './AddTransactionButton.module.scss';
import AddTransactionPopUp from './AddTransactionPopUp/AddTransactionsPopUp';


const AddTransactionButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useShowChooseTypeTransactionPopUp();
  const [showReceiptPopUp] = useShowReceiptPopUp();

  useEffect(() => {
    document.addEventListener('click', (event) => handleClickOutside(event));
    return () => {
      document.removeEventListener('click', (event) => handleClickOutside(event));
    };
  }, [ref]);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Element)) {
      setShowPopUp(false);
    }
  };

  const handlePlusButtonClick = () => {
    setShowPopUp(!showPopUp);
  };

  return (
    <section ref={ref} className={classNames({
      [styles.addtransaction__container]: true,
    })}>
      <AiOutlinePlusCircle 
        role="button"
        className={classNames({
          [styles.addtransaction__button]: true,
          [styles['addtransaction__button-x']]: showPopUp,
          [styles['addtransaction__button-position']]: showReceiptPopUp
        })} title='Add a new transaction'
        onClick={handlePlusButtonClick}
      />
      <AddTransactionPopUp />
    </section>
  );
};

export default AddTransactionButton;
