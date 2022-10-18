import { useCurrentReceipt, useShowReceiptPopUp } from 'assets/state/hooks/addTransactionHooks';
import styles from './TransactionReceipt.module.scss';

const TransactionReceipt = () => {
  const [showReceipt, setShowReceipt] = useShowReceiptPopUp();
  const [currentTransaction, setCurrentTransaction] = useCurrentReceipt();

  const handleCloseButton = () => {
    const body = document.querySelector('body');
    if (body) {
      body.style.overflow = 'visible';
    }
    setCurrentTransaction(null);
    setShowReceipt(false);
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
    console.log('hour', hour);
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
                <button
                  className={styles.receipt__closebutton}
                  type='button'
                  onClick={handleCloseButton}
                >+</button>
                <h2 className={styles.receipt__title}>Transaction Receipt</h2>
                <ul className={styles.receipt__list}>
                  <li className={styles.receipt__type}>
                    {currentTransaction.type[0].toUpperCase() + currentTransaction.type.substring(1)} transaction
                  </li>
                  <li className={styles.receipt__description}>
                    {currentTransaction.description}
                  </li>
                  <li className={styles.receipt__amount}>
                    <span>Amount ($): </span>
                    R$ {(+currentTransaction.amount).toFixed(2)}
                  </li>
                  <li className={styles.receipt__category}>
                    <span>Category: </span>
                    {currentTransaction.category}</li>
                  <li className={styles.receipt__date}>
                    <span>Transaction&apos;s date: </span>
                    {formatDateShort(currentTransaction.date)}</li>
                  <li className={styles.receipt__account}>
                    <span>Account: </span>
                    {currentTransaction.account}</li>
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
              </section>
            </div >
          )
          : null
      }
    </>
  );
};

export default TransactionReceipt;