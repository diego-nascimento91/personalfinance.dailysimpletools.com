import styles from './Welcome.module.scss';
import { useUser } from 'assets/state/hooks/useUser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props{
  month: Date, 
  setMonth: React.Dispatch<React.SetStateAction<Date>>
}
const Welcome = (props: Props) => {
  const { month, setMonth } = props;
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