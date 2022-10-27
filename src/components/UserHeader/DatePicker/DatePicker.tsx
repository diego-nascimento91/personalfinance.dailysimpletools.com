import { handleFetchTransactionsMonth } from 'assets/functions/handleDatabaseFunctions';
import { useChosenMonth, useTransactionsMonth, useUser } from 'assets/state/hooks/firebaseHooks';
import { useEffect } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import DatePickerReact from 'react-datepicker';
import styles from './DatePicker.module.scss';

const DatePicker = () => {
  const [month, setMonth] = useChosenMonth();
  const [user] = useUser();
  const [, setTransactionsMonth] = useTransactionsMonth();

  useEffect(() => {
    if (user) {
      if(month) handleFetchTransactionsMonth(user.uid, setTransactionsMonth, month);
    }
  }, [month]);

  return (
    <div className={styles.datepicker__container}>
      <label className={styles.datepicker__label} htmlFor='datepickerinput'>Month: </label>
      <div className={styles.datepicker__input}>
        <div className={styles['datepicker__component--container']}>
          <DatePickerReact
            className={styles.datepicker__component}
            selected={month}
            onChange={(date) => setMonth(date as Date)}
            showMonthYearPicker
            dateFormat="MMMM"
            id='datepickerinput'
          />
        </div>
        <AiOutlineDown className={styles.datepicker__arrow} />
      </div>
    </div>
  );
};

export default DatePicker;