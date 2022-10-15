import styles from './DatePicker.module.scss';
import DatePickerReact from 'react-datepicker';
import { useChosenMonth } from 'assets/state/hooks/useChosenMonth';

const DatePicker = () => {
  const [ month, setMonth ] = useChosenMonth();

  return (
    <section className='theme__homesections'>
      <label className={styles.datepicker__label}>
        Month:
        <DatePickerReact
          className={styles.datepicker__component}
          selected={month}
          onChange={(date) => setMonth(date as Date)}
          showMonthYearPicker
          dateFormat="MMMM"
        />
      </label>
    </section>
  );
};

export default DatePicker;