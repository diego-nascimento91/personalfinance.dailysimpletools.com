import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './InputCurrency.module.scss';

interface Props {
  moneyAmount: number,
  setMoneyAmount: (amount: number) => void,
  allowNumbers?: 'positive' | 'negative'
}
const InputCurrency = (props: Props) => {
  const { moneyAmount, setMoneyAmount, allowNumbers } = props;
  const [numberSign, setNumberSign] = useState<'+' | '-'>('+');

  //useEffect to set correctly the numberSign according to the allowNumbers variable.
  useEffect(() => {
    if (allowNumbers === 'positive') {
      setNumberSign('+');
    }
    else if (allowNumbers === 'negative')
      setNumberSign('-');
  }, [allowNumbers]);

  //use effect is to load the correct number sign in case of editting a current account.
  //if creating an account, number sign will be the default + with moneyAmount 0.
  useEffect(() => {
    if (moneyAmount === 0)
      return;
    else if (moneyAmount > 0)
      setNumberSign('+');
    else
      setNumberSign('-');
  }, [moneyAmount]);

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
    let finalValue;
    if (input === '+') {
      setNumberSign('+');
      finalValue = Math.abs(moneyAmount);
    } else {
      setNumberSign('-');
      finalValue = -Math.abs(moneyAmount);
    }

    setMoneyAmount(finalValue);
  };

  const handleNumberSignOnKeyUp = (key: string) => {
    if (allowNumbers)
      return;

    if (key === '-') {
      handleNumberSignClick('-');
    } else if (key === '+') {
      handleNumberSignClick('+');
    }
  };

  return (
    <div className={styles.inputCurrency__container}>

      <div id='number-sign-options'>
        {
          !allowNumbers
            ? (
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
            )
            : null
        }
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