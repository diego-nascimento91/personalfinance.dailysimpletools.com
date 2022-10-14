import { ITransaction } from 'assets/interfaces/interfaces';
import classNames from 'classnames';
import styles from './TransactionSummary.module.scss';


const TransactionSummary = ({ transaction }:{ transaction: ITransaction }) => {

  const formatDate = (date: Date) => {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${day}/${month}/${year}`;

    return dateString;
  };

  return (
    <div className={styles.transaction__container}>
      <div className={styles.transaction__payment}>{transaction.payment}</div>
      <div className={styles.transaction__body}>
        <div className={styles.transaction__description__date}>
          <p className={styles.transaction__description}>{transaction.description}</p>
          <p className={styles.transaction__date}>{formatDate(transaction.date)}</p>
        </div>
        <div className={classNames({
          [styles.transaction__price]: true,
          [styles.transaction__price__positive]: transaction.type === 'income',
          [styles.transaction__price__negative]: transaction.type === 'expense',
        })}>
          { transaction.type === 'expense' ? '- ' : '+ '}
          R$ {(+transaction.price).toFixed(2)}</div>
      </div>
    </div>
  );
};

export default TransactionSummary;