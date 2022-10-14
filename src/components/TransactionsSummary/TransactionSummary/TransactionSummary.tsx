import { ITransaction } from 'assets/interfaces/interfaces';
import classNames from 'classnames';
import styles from './TransactionSummary.module.scss';


const TransactionSummary = ({ transaction }: { transaction: ITransaction }) => {

  const formatDate = (date: Date) => {
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const dateString = `${day < 10 ? '0' + day : day}/${month.replace(/\./g, '')}`;

    return dateString;
  };

  return (
    <div className={styles.transaction__container}>
      <div className={styles.transaction__category}>
        <p className={styles['transaction__category--icon']}>{transaction.category[0]}</p>
      </div>
      <div className={styles.transaction__body}>
        <p className={styles.transaction__place}>{transaction.place}</p>
        <p className={
          classNames({
            [styles.transaction__price]: true,
            [styles.transaction__price__positive]: transaction.type === 'income',
            [styles.transaction__price__negative]: transaction.type === 'expense'
          })}>
          {transaction.type === 'expense' ? '- ' : '+ '} R$ {(+transaction.price).toFixed(2)}
        </p>
      </div>
      <p className={styles.transaction__date}>{formatDate(transaction.date)}</p>
    </div>
  );
};

export default TransactionSummary;