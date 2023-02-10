import { useState } from 'react';
import { ITransactionType } from 'assets/interfaces/interfaces';
import styles from './AddTransactionForm.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import AddTFormHeader from './AddTFormHeader/AddTFormHeader';
import AddTFormOptionTabs from './AddTFormOptionTabs/AddTFormOptionTabs';
import AddTFormInputs from './AddTFormInputs/AddTFormInputs';


const AddTransactionForm = () => {
  const [tabTransactionOption, setTabTransactionOption] = useState<'income-expense' | 'transfer-withdraw'>('income-expense');
  const [transactionType, setTransactionType] = useState<ITransactionType | null>(null);


  return (
    <section className={`${stylesComponents.pageComponents} ${styles.addTransaction__container}`}>
      <AddTFormHeader transactionType = {transactionType} />
      <AddTFormOptionTabs 
        setTabTransactionOption={setTabTransactionOption} 
        tabTransactionOption={tabTransactionOption}
      />
      <AddTFormInputs 
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        tabTransactionOption={tabTransactionOption}
      />
    </section>
  );
};

export default AddTransactionForm;