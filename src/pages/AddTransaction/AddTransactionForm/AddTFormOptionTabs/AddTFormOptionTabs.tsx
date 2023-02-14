import { SetterOrUpdater } from 'recoil';
import classNames from 'classnames';
import styles from './AddTFormOptionTabs.module.scss';
import { useCurrentTransaction } from 'assets/state/hooks/addTransactionHooks';


interface Props {
  tabTransactionOption: 'income-expense' | 'transfer-withdraw',
  setTabTransactionOption: SetterOrUpdater<'income-expense' | 'transfer-withdraw'>,
}
const AddTFormOptionTabs = (props: Props) => {
  const { tabTransactionOption, setTabTransactionOption } = props;
  const [currentTransaction] = useCurrentTransaction();

  return (
    <div className={styles.addTFormOptionTabs__container} >
      {
        !currentTransaction || (currentTransaction?.type !== 'transfer')
          ? (
            <div id='option-tab1'
              className={classNames({
                [styles.addTFormOptionTabs__formOption]: true,
                [styles.addTFormOptionTabs__formOptionChosen]: tabTransactionOption === 'income-expense',
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
        !currentTransaction || (currentTransaction.type === 'transfer')
          ? (
            <div id='option-tab2'
              className={classNames({
                [styles.addTFormOptionTabs__formOption]: true,
                [styles.addTFormOptionTabs__formOptionChosen]: tabTransactionOption === 'transfer-withdraw',
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