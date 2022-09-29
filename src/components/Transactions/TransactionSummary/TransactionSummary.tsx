import { ITransaction } from 'assets/interfaces/interfaces';
import styles from './TransactionSummary.module.scss';

interface Props {
  transaction: ITransaction
}

const TransactionSummary = (props: Props) => {
  const { transaction } = props;

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
      <div className={styles.transaction__description}>
        <p>{transaction.description}</p>
        <p className={styles['transaction__description--price']}>R$ {(+transaction.price).toFixed(2)}</p>
      </div>
      <div className={styles.transaction__date}>{formatDate(transaction.date)}</div>
    </div>
  );
};

export default TransactionSummary;