import { useEffect, useState } from 'react';
import { SetterOrUpdater } from 'recoil';
import classNames from 'classnames';
import styles from './InputCurrency.module.scss';

interface Props {
  moneyAmount: number,
  setMoneyAmount: SetterOrUpdater<number>
}
const InputCurrency = (props: Props) => {
  const { moneyAmount, setMoneyAmount } = props;
  const [numberSign, setNumberSign] = useState<'+' | '-'>('+');

  //use effect is to load the correct number sign in case of editting a current account.
  //if creating an account, number sign will be the default + with moneyAmount 0.
  useEffect(() => {
    if (moneyAmount > 0)
      setNumberSign('+');
    else
      setNumberSign('-');
  }, []);

  const maskCurrencyNumber = (value: number) => {
    const currency = numberSign === '+' ? '+ $' : '- $';

    const options = { minimumFractionDigits: 2 };
    const maskedNumber = currency + ' ' + (new Intl.NumberFormat('en-US', options).format(Math.abs(value))).toLocaleString().replace(/,/g, ' ');

    return maskedNumber;
  };

  const unmaskCurrencyNumber = (value: string) => {
    const valueOnlyNumbers = value.replace('.', '').replace(',', '').replace(/\D/g, '');
    const valueToFloat = parseFloat(valueOnlyNumbers) / 100;
    const finalValue = isNaN(valueToFloat) ? 0 : numberSign === '+' ? valueToFloat : - valueToFloat;
    setMoneyAmount(finalValue);
  };

  const handleNumberSignClick = (input: '+' | '-') => {
    if (input === '+') {
      setNumberSign('+');
      setMoneyAmount(Math.abs(moneyAmount));
    } else {
      setNumberSign('-');
      setMoneyAmount(-Math.abs(moneyAmount));
    }
  };

  const handleNumberSignOnKeyUp = (key: string) => {
    if (key === '-') {
      handleNumberSignClick('-');
    } else if (key === '+') {
      handleNumberSignClick('+');
    }
  };

  return (
    <div className={styles.inputCurrency__container}>
      <div id='number-sing-options' role='select' className={styles.inputCurrency__numberSignOptions}>
        <div
          role='option'
          className={classNames({
            [styles.inputCurrency__numberSign]: true,
            [styles.inputCurrency__numberSignSelected]: numberSign === '+'
          })}
          onClick={() => handleNumberSignClick('+')}
        >+ $</div>
        <div
          role='option'
          className={classNames({
            [styles.inputCurrency__numberSign]: true,
            [styles.inputCurrency__numberSignSelected]: numberSign === '-'
          })}
          onClick={() => handleNumberSignClick('-')}
        >- $</div>
      </div>

      <input
        className={styles.inputCurrency__input}
        required
        type="text"
        onKeyUp={(e) => handleNumberSignOnKeyUp(e.key)}
        onChange={(e) => unmaskCurrencyNumber(e.target.value)}
        value={maskCurrencyNumber(moneyAmount)}
        placeholder='0.00'
      />
    </div>
  );
};

export default InputCurrency;