import { AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'state/hooks/user';
import { useShowReceipt } from 'state/hooks/addPlusButton';
import { useSelectedTransaction_toBeEdited } from 'state/hooks/transactions';
import { useDeleteTransaction } from 'state/reducers/transactions';
import styles from './TransactionReceipt.module.scss';

const TransactionReceipt = () => {
  const [user] = useUser();
  const [showReceipt, setShowReceipt] = useShowReceipt();
  const [currentTransaction, setCurrentTransaction] = useSelectedTransaction_toBeEdited();
  const deleteTransaction = useDeleteTransaction();
  const nav = useNavigate();

  const closeReceiptPopUp = () => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = 'visible';
    }
    setShowReceipt(false);
  };

  const handleCloseButton = () => {
    setCurrentTransaction(null);
    closeReceiptPopUp();
  };

  const handleEditButtonClick = () => {
    closeReceiptPopUp();
    nav('/newtransaction');
  };

  const handleDeleteButtonClick = async () => {
    if (user && currentTransaction) {
      deleteTransaction(currentTransaction); 
      handleCloseButton();
    }
  };

  const formatDateShort = (date: Date) => {
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getUTCFullYear();
    const dateString = `${day < 10 ? '0' + day : day}/${month.replace(/\./g, '')}/${year}`;

    return dateString;
  };

  const formatDateLong = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    const hour = date.getHours();
    const min = date.getMinutes();
    const dateString = `${day < 10 ? '0' + day : day} of ${month.toLocaleLowerCase()} of ${year} at ${hour < 10 ? '0' + hour : hour}:${min < 10 ? '0' + min : min}`;

    return dateString;
  };

  return (
    <>
      {
        showReceipt && currentTransaction
          ? (
            <div className={styles.receipt__background} >
              <section className={styles.receipt__container}>
                <AiFillCloseCircle
                  role='button'
                  className={styles.receipt__closebutton}
                  onClick={handleCloseButton}
                />
                <h2 className={styles.receipt__title}>Transaction Receipt</h2>
                <ul className={styles.receipt__list}>
                  <li className={styles.receipt__type}>
                    {currentTransaction.type[0].toUpperCase() + currentTransaction.type.substring(1)} transaction
                  </li>
                  <li className={styles.receipt__description}>
                    {currentTransaction.name}
                  </li>
                  <li className={styles.receipt__amount}>
                    <span>Amount ($): </span>
                    R$ {(+currentTransaction.amount).toFixed(2)}
                  </li>
                  <li className={styles.receipt__category}>
                    <span>Category: </span>
                    <span className={styles.receipt__categorySpan}>{currentTransaction.category?.name}</span>
                  </li>
                  <li className={styles.receipt__date}>
                    <span>Transaction&apos;s date: </span>
                    {formatDateShort(currentTransaction.date)}
                  </li>
                  <li className={styles.receipt__account}>
                    <span>Account: </span>
                    <span className={styles.receipt__accountSpan}>{currentTransaction.account.name}</span>
                  </li>
                  <li className={styles.receipt__notes}>
                    <span>Notes: </span>
                    {currentTransaction.note}</li>
                  <li className={styles.receipt__publishDate}>
                    Added {formatDateLong(currentTransaction.publishDate)}
                  </li>
                  <li className={styles.receipt__id}>
                    ID {currentTransaction.id}
                  </li>
                </ul>
                <div className={styles.receipt__buttons}>
                  <button
                    type='button'
                    className={styles.receipt__button}
                    onClick={handleEditButtonClick}
                  >Edit</button>
                  <button
                    type='button'
                    className={styles.receipt__button}
                    onClick={handleDeleteButtonClick}
                  >Delete</button>
                </div>
              </section>
            </div >
          )
          : null
      }
    </>
  );
};

export default TransactionReceipt;