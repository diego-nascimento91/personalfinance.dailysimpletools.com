import { ITransaction } from 'assets/interfaces/interfaces';
import { useCurrentTransaction, useShowChooseTypeTransactionPopUp, useShowReceiptPopUp } from 'assets/state/hooks/addTransactionHooks';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import TransactionReceipt from './TransactionReceipt/TransactionReceipt';
import styles from './TransactionSummary.module.scss';
import stylesImgError from 'assets/styles/imgError.module.scss';


const TransactionSummary = ({ transaction } : { transaction: ITransaction }) => {
  const [showReceipt, setShowReceipt] = useShowReceiptPopUp();
  const [, setCurrentTransaction] = useCurrentTransaction();
  const [showChooseTypeTransactionPopUp] = useShowChooseTypeTransactionPopUp();
  const [categories] = useCategories();
  const [user] = useUser();
  const [imageURL, setImageURL] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if(user) {
      getCategoryURL();
    }
  }, [categories, user]);

  const formatDate = (date: Date) => {
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const dateString = `${day < 10 ? '0' + day : day}/${month.replace(/\./g, '')}`;

    return dateString;
  };

  const handleTransactionClick = () => {
    if (!showChooseTypeTransactionPopUp) {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'hidden';
      }
      setCurrentTransaction(transaction);
      setShowReceipt(true);
    }
  };

  const getCategoryURL = () => {
    if(transaction.category) setImageURL(transaction.category.icon);
    else setImageURL('');
  };

  return (
    <>
      <div className={styles.transaction__container} onClick={handleTransactionClick}>
        <div className={styles.transaction__category}>
          {
            imageURL && imageURL.length > 0 
              ? (
                <>
                  <img className={styles['transaction__category--icon']} src={imageURL} alt="icon"
                    onError={({ currentTarget }) => {
                      currentTarget.src = '';
                      currentTarget.className = stylesImgError.imgError;
                      setImageError(true);
                    }}
                  />
                  {imageError && <span className={styles['transaction__category--iconText']} >{transaction.category?.name[0]}</span>}
                </>
              )
              : (
                <span className={styles['transaction__category--iconText']} >{
                  transaction.category && transaction.category.name ? transaction.category.name[0] : 'T' }</span>
              )
          }
        </div>
        <div className={styles.transaction__body}>
          <p className={styles.transaction__description}>{transaction.name}</p>
          <p className={
            classNames({
              [styles.transaction__amount]: true,
              [styles.transaction__amount__positive]: transaction.amount >= 0,
              [styles.transaction__amount__negative]: transaction.amount < 0
            })}>
            {transaction.amount >= 0 ? '+ ' : '- '} $ {(Math.abs(transaction.amount)).toFixed(2)}
          </p>
        </div>
        <p className={styles.transaction__date}>{formatDate(transaction.date)}</p>
      </div>
      {
        showReceipt
          ? <TransactionReceipt />
          : null
      }

    </>

  );
};

export default TransactionSummary;