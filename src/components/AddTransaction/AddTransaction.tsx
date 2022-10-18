import styles from './AddTransaction.module.scss';
import AddTransactionPopUp from './AddTransactionPopUp/AddTransactionsPopUp';
import { useEffect, useRef } from 'react';
import AddTransactionForm from './AddTransactionForm/AddTransactionForm';
import { useShowPopUp } from 'assets/state/hooks/addTransactionHooks';
import classNames from 'classnames';

interface Props {
  handleUpdateTransactions: () => void,
}
const AddTransaction = (props: Props) => {
  const { handleUpdateTransactions } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [showPopUp, setShowPopUp] = useShowPopUp();

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
    <section ref={ref} className={styles.addtransaction__container}>
      <button
        type="button"
        className={classNames({
          [styles.addtransaction__button]: true,
          [styles['addtransaction__button-x']]: showPopUp
        })} title='Add a new transaction'
        onClick={handlePlusButtonClick}
      >+</button>
      <AddTransactionPopUp />
      <AddTransactionForm handleUpdateTransactions={handleUpdateTransactions} />
    </section>
  );
};

export default AddTransaction;
