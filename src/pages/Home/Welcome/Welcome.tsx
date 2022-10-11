// import { useTransactions } from 'assets/state/hooks/useTransactions';
import styles from './Welcome.module.scss';
import { useUser } from 'assets/state/hooks/useUser';
// import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import { fetchTransactions } from 'assets/functions/fetchTransactions';

interface Props{
  month: Date, 
  setMonth: React.Dispatch<React.SetStateAction<Date>>
}
const Welcome = ({ month, setMonth }: Props) => {
  const [user,] = useUser();

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