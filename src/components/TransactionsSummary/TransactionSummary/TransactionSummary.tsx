import { ITransaction } from 'utils/interfaces';
import { useUser } from 'state/hooks/user';
import { useEffect, useState } from 'react';
import { useCategories } from 'state/hooks/categories';
import { useSelectedTransaction_toBeEdited } from 'state/hooks/transactions';
import { useShowPlusButton, useShowReceipt } from 'state/hooks/addPlusButton';
import classNames from 'classnames';
import TransactionReceipt from './TransactionReceipt/TransactionReceipt';
import styles from './TransactionSummary.module.scss';
import stylesImgError from 'styles/imgError.module.scss';


const TransactionSummary = ({ transaction }: { transaction: ITransaction }) => {
  const [showReceipt, setShowReceipt] = useShowReceipt();
  const [, setCurrentTransaction] = useSelectedTransaction_toBeEdited();
  const [showChooseTypeTransactionPopUp] = useShowPlusButton();
  const [categories] = useCategories();
  const [user] = useUser();
  const [imageURL, setImageURL] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
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
    if (transaction.category) setImageURL(transaction.category.icon);
    else setImageURL('');
  };

  return (
    <>
      <div className={styles.transaction} onClick={handleTransactionClick}>
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
                  transaction.category && transaction.category.name ? transaction.category.name[0] : 'T'}</span>
              )
          }
        </div>
        <div className={styles.transaction__body}>
          <p className={styles['transaction__body--name']}>{transaction.name}</p>
          <p className={styles['transaction__body--account']}>{transaction.account.name}</p>
          <p className={styles['transaction__body--date']}>{formatDate(transaction.date)}</p>
          <p className={
            classNames({
              [styles['transaction__body--amount']]: true,
              [styles['transaction__body--amountPositive']]: transaction.amount >= 0,
              [styles['transaction__body--amountNegative']]: transaction.amount < 0
            })}>
            {transaction.amount >= 0 ? '+ ' : '- '} $ {(Math.abs(transaction.amount)).toFixed(2)}
          </p>
        </div>
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