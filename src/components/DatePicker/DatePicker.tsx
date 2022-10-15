import styles from './DatePicker.module.scss';
import DatePickerReact from 'react-datepicker';

interface Props{
  month: Date, 
  setMonth: React.Dispatch<React.SetStateAction<Date>>
}

const DatePicker = (props: Props) => {
  const { month, setMonth } = props;

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