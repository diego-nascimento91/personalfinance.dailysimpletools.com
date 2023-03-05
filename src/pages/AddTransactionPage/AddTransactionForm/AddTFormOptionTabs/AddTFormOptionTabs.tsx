import classNames from 'classnames';
import styles from './AddTFormOptionTabs.module.scss';

type typeTab = 'income-expense' | 'transfer-withdraw';

interface Props {
  isIncomeExpenseTransaction: boolean,
  isTransferTransaction: boolean,
  isUpdateTransaction: boolean,
  setTabTransactionOption: (typeTab: typeTab) => void,
}
const AddTFormOptionTabs = (props: Props) => {
  const { isIncomeExpenseTransaction, isTransferTransaction, isUpdateTransaction, setTabTransactionOption } = props;

  return (
    <div className={styles.addTFormOptionTabs__container} >
      {
        !isUpdateTransaction || (isUpdateTransaction && isIncomeExpenseTransaction)
          ? (
            <div id='option-tab1'
              className={classNames({
                [styles.addTFormOptionTabs__formOption]: true,
                [styles.addTFormOptionTabs__formOptionChosen]: isIncomeExpenseTransaction,
              })}
              role='option'
              onClick={() => setTabTransactionOption('income-expense')}
            >
              Income/Expense
            </div>
          )
          : null
      }

      {
        !isUpdateTransaction || (isUpdateTransaction && isTransferTransaction)
          ? (
            <div id='option-tab2'
              className={classNames({
                [styles.addTFormOptionTabs__formOption]: true,
                [styles.addTFormOptionTabs__formOptionChosen]: isTransferTransaction,
              })}
              role='option'
              onClick={() => setTabTransactionOption('transfer-withdraw')}
            >
              Transfer/Withdraw
            </div>
          )
          : null
      }
    </div>
  );
};

export default AddTFormOptionTabs;