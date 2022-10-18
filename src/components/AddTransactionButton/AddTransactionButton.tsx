import styles from './AddTransactionButton.module.scss';
import AddTransactionPopUp from './AddTransactionPopUp/AddTransactionsPopUp';
import { useEffect, useRef } from 'react';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm';
import { useShowAddFormPopUp, useShowChooseTypeTransactionPopUp, useShowReceiptPopUp } from 'assets/state/hooks/addTransactionHooks';
import classNames from 'classnames';

interface Props {
  handleUpdateTransactions: () => void,
}
const AddTransactionButton = (props: Props) => {
  const { handleUpdateTransactions } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useShowChooseTypeTransactionPopUp();
  const [showReceiptPopUp] = useShowReceiptPopUp();
  const [showAddForm] = useShowAddFormPopUp();

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
      [styles['addtransaction__container-position']]: !showAddForm && !showReceiptPopUp
    })}>
      <button
        type="button"
        className={classNames({
          [styles.addtransaction__button]: true,
          [styles['addtransaction__button-x']]: showPopUp,
        })} title='Add a new transaction'
        onClick={handlePlusButtonClick}
      >+</button>
      <AddTransactionPopUp />
      <AddTransactionForm handleUpdateTransactions={handleUpdateTransactions} />
    </section>
  );
};

export default AddTransactionButton;
