import { useTransactions } from 'assets/state/hooks/useTransactions';
import styles from './Welcome.module.scss';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchTransactions } from 'assets/functions/fetchTransactions';

const Welcome = () => {
  const [month, setMonth] = useState(new Date());
  const [, setTransactions] = useTransactions();
  const [user,] = useUser();

  useEffect(() => {
    if (user) {
      const { firstDay, lastDay } = formatDate(month);
      const queries = [];
      queries.push({
        field: 'date',
        condition: '>=',
        value: firstDay
      });
      queries.push({
        field: 'date',
        condition: '<=',
        value: lastDay
      });
      const collectionPath = `users/${user?.uid}/transactions`;
      fetchTransactions({ collectionPath, setTransactions, queries });
    }
  }, [month, user]);

  const formatDate = (date: Date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month);
    const lastDay = new Date(year, month + 1, 0);

    return { firstDay, lastDay };
  };

  return (
    <section className='theme__homesections'>
      <div>
        <p>Welcome {user?.email}!</p>

        <label className={styles.datepicker__label}>
          Month:
          <DatePicker
            className={styles.datepicker__component}
            selected={month}
            onChange={(date) => setMonth(date as Date)}
            showMonthYearPicker
            dateFormat="MMMM"
          />
        </label>
      </div>
    </section>
  );
};

export default Welcome;