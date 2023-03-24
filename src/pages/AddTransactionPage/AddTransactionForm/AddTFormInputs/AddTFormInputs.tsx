import { FormTypeData } from '../utils/formTypes';
import styles from './AddTFormInputs.module.scss';
import InputCurrency from 'components/InputCurrency/InputCurrency';
import SelectAccount from './SelectAccount/SelectAccount';
import SelectCategory from './SelectCategory/SelectCategory';

type Props = FormTypeData & {
  updateFields: (fields: Partial<FormTypeData>) => void,
  isTransferTransaction: boolean,
  isIncomeExpenseTransaction: boolean,
  buttonTxt: string,
}

const AddTFormInputs = (props: Props) => {
  const { name, amount, category, categoryDescription, transactionDate, account, accountTo, accountIDFrom, accountIDTo, notes, updateFields } = props;
  const { isTransferTransaction, isIncomeExpenseTransaction, buttonTxt } = props;


  return (
    <>
      <label className={styles.addTFormInputs__label}> How would you like to call this transaction?
        <input
          className={styles.addTFormInputs__input}
          required
          type="text"
          onChange={(event) => updateFields({ name: event.target.value })}
          value={name}
        />
      </label>

      <label className={styles.addTFormInputs__label}> How much was it?
        <InputCurrency
          allowNumbers={isTransferTransaction ? 'negative' : undefined}
          moneyAmount={amount}
          setMoneyAmount={(amount: number) => updateFields({ amount: amount })}
        />
      </label>

      <div id='category'>
        { isIncomeExpenseTransaction && 
          <SelectCategory amount={amount} category={category} categoryDescription={categoryDescription} isIncomeExpenseTransaction={isIncomeExpenseTransaction} updateFields = {updateFields}/>
        }
      </div>

      <label className={styles.addTFormInputs__label}> Which date?
        <input
          className={`${styles.addTFormInputs__input} ${styles.addTFormInputs__inputDate}`}
          required
          type="date"
          onChange={(event) => updateFields({ transactionDate: event.target.value })}
          value={transactionDate}
        />
      </label>

      <div id='account'>
        {
          isIncomeExpenseTransaction
            ? <SelectAccount
              account={account}
              accountID={accountIDFrom}
              label='Which account?'
              setAccount={(account: string) => updateFields({ account: account })}
            />
            : <>
              <SelectAccount
                account={account}
                accountID={accountIDFrom}
                label='From account:'
                setAccount={(account: string) => updateFields({ account: account })}
              />
              <SelectAccount
                account={accountTo}
                accountID={accountIDTo}
                label='To account:'
                error= { {message: 'Accounts cannot be the same!', status: account === accountTo} }
                setAccount={(accountTo: string) => updateFields({ accountTo: accountTo })}
              />
            </>
        }
      </div>

      <label className={styles.addTFormInputs__label}> Notes:
        <textarea
          className={styles.addTFormInputs__notes}
          onChange={(event) => updateFields({ notes: event.target.value })}
          value={notes}
          placeholder='(optional) take any notes you may find useful about this transaction.'
        />
      </label>

      <button disabled={account === accountTo} className={styles.addTFormInputs__button} type='submit'>{buttonTxt}</button>
    </>
  );
};

export default AddTFormInputs;