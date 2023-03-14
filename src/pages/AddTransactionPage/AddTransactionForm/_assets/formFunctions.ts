import { IAccount, ICategory, ITransaction, ITransactionType } from 'assets/interfaces/interfaces';
import { FormTypeData } from './formTypes';
import { useState } from 'react';
import { typeTab } from './formTypes';
import { handleCreateDocFunction, handleCreateDocsTransferFunction, handleUpdateDocFunction } from 'assets/functions/handleDatabaseFunctions';
import { useCurrentTransaction } from 'assets/state/hooks/transactions';


export const useMultitabForm = (amount: number) => {
  const [currentTransaction] = useCurrentTransaction();
  const [currentTabIndex, setCurrentTabIndex] = useState(currentTransaction?.type === 'transfer' ? 1 : 0);

  const getFormTexts = (num: number) => {
    if (currentTransaction) {
      if (currentTabIndex === 1) return {
        title: 'Update Transfer Transaction',
        buttonTxt: 'Submit',
      };
      return {
        title: 'Update Transaction',
        buttonTxt: 'Submit',
      };
    }
    if (currentTabIndex === 1) return {
      title: 'Add a new Transfer Transaction',
      buttonTxt: 'Submit new transfer Transaction',
    };
    if (num === 0) return {
      title: 'Add a new Transaction',
      buttonTxt: 'Submit'
    };
    if (num > 0) return {
      title: 'Add a new Income Transaction',
      buttonTxt: 'Submit Income Transaction',
    };
    return {
      title: 'Add a new Expense Transaction',
      buttonTxt: 'Submit Expense Transaction',
    };
  };

  const goToTab = (tabName: typeTab) => {
    if (tabName === 'income-expense')
      setCurrentTabIndex(0);
    else
      setCurrentTabIndex(1);
  };

  return {
    formTitle: getFormTexts(amount).title,
    formButtonText: getFormTexts(amount).buttonTxt,
    isUpdateTransaction: !!currentTransaction,
    isIncomeExpenseTransaction: currentTabIndex === 0,
    isTransferTransaction: currentTabIndex === 1,
    goToTab,
  };
};

export const loadCurrentTransaction = (
  accounts: IAccount[],
  categories: ICategory[],
  currentTransaction: ITransaction,
  isTransferTransaction: boolean,
  transactions: ITransaction[],
  updateFields: (fields: Partial<FormTypeData>) => void,
) => {
  let name = '';
  let amount = 0;
  let category = '';
  let account = '';
  let accountTo = '';
  let transactionIDFrom = '';
  let transactionIDTo = '';
  let accountIDFrom = '';
  let accountIDTo = '';

  const categoryObj = categories.find(item => (item.id === currentTransaction.category?.id));
  if(categoryObj) category = JSON.stringify(categoryObj);


  if (isTransferTransaction) {
    name = currentTransaction.name.split(': ')[1];
    amount = -Math.abs(currentTransaction.amount);

    let transactionFrom: ITransaction;
    let transactionTo: ITransaction;
    const otherTransaction = transactions.find(transaction => (transaction.id === currentTransaction.transferedTransactionID));

    if (currentTransaction.amount >= 0) {
      transactionFrom = otherTransaction as ITransaction;
      transactionTo = currentTransaction;
    } else {
      transactionFrom = currentTransaction;
      transactionTo = otherTransaction as ITransaction;
    }
    if (transactionFrom) {
      transactionIDFrom = transactionFrom.id as string;
      accountIDFrom =transactionFrom.account.id as string;
      const accountFromObj = accounts.find(account => (account.name === transactionFrom.account.name));
      if (accountFromObj) account = JSON.stringify(accountFromObj);

    }
    if (transactionTo) {
      transactionIDTo = transactionTo.id as string;
      accountIDTo =transactionTo.account.id as string;
      const accountToObj = accounts.find(account => (account.name === transactionTo.account.name));
      if (accountToObj) accountTo = JSON.stringify(accountToObj);
    }
  }
  else {
    name = currentTransaction.name;
    amount = currentTransaction.amount;
    //Here the code is looking fo the object in account that is the same obj of currentTransaction.account. The reason it's doing this is because when doing sringify(currentTransaciton.account) and stringify(account), the strings the result of them are different and so the Account of current transaction doesn't load on the Edit Form because the sequence of the obj properties changes (not sure why this happens).
    const accountObj = accounts.find(item => (item.id === currentTransaction.account.id));
    if (accountObj) account = JSON.stringify(accountObj);
    accountIDFrom = currentTransaction.account.id as string;
  }

  updateFields({
    name: name,
    amount: amount,
    transactionType: currentTransaction.type,
    category: category,
    transactionDate: currentTransaction.date.toISOString().split('T')[0],
    account: account,
    accountTo: accountTo,
    notes: currentTransaction.note,
    transactionIDFrom: transactionIDFrom,
    transactionIDTo: transactionIDTo,
    accountIDFrom: accountIDFrom,
    accountIDTo: accountIDTo,
  });
};

export const submitForm = async (
  currentTransaction: ITransaction | null,
  data: FormTypeData,
  isIncomeExpenseTransaction: boolean,
  isUpdateTransaction: boolean,
  userId: string,
) => {
  const { name, amount, transactionDate, account, accountTo, notes, category, transactionIDFrom, transactionIDTo } = data;

  if (isIncomeExpenseTransaction) {
    const transaction = getTransactionDoc(name, amount >= 0 ? 'income' : 'expense', amount, transactionDate, account, notes, category);

    if (isUpdateTransaction) {
      await handleUpdateDocFunction('transactions', userId, { ...transaction, id: currentTransaction?.id });
    } else {
      await handleCreateDocFunction('transactions', userId, transaction);
    }
  } else {
    const nameFrom = `Transfer sent to ${JSON.parse(accountTo).name}: ` + name;
    const transactionFrom = getTransactionDoc(nameFrom, 'transfer', -Math.abs(amount), transactionDate, account, notes, undefined, transactionIDTo);

    const nameTo = `Transfer received from ${JSON.parse(account).name}: ` + name;
    const transactionTo = getTransactionDoc(nameTo, 'transfer', Math.abs(amount), transactionDate, accountTo, notes, undefined, transactionIDFrom);

    if (currentTransaction) {
      await handleUpdateDocFunction('transactions', userId, { ...transactionFrom, id: transactionIDFrom }, true);
      await handleUpdateDocFunction('transactions', userId, { ...transactionTo, id: transactionIDTo });
    } else {
      await handleCreateDocsTransferFunction('transactions', userId, transactionFrom, transactionTo);
    }
  }
};

export const resetForm = (updateFields: (fields: Partial<FormTypeData>) => void) => {
  updateFields({
    name: '',
    amount: 0,
    transactionType: null,
    category: '',
    categoryDescription: '',
    transactionDate: (new Date(Date.now() - new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0],
    account: '',
    accountTo: '',
    notes: '',
    transactionIDFrom: '',
    transactionIDTo: ''
  });
};

export const getTransactionDoc = (
  name: string,
  transactionType: ITransactionType,
  amount: number,
  transactionDate: string,
  account: string,
  notes: string,
  category?: string,
  transferedTransactionID?: string
) => {

  const transaction: ITransaction = {
    name: name,
    type: transactionType,
    amount: amount,
    category: category ? JSON.parse(category) : null,
    date: new Date(transactionDate.replace(/-/g, '/')), //replace '-' per '/' makes the date to be created in the user timezone, instead of UTC
    account: JSON.parse(account),
    note: notes,
    publishDate: new Date(),
    transferedTransactionID: transferedTransactionID ? transferedTransactionID : ''
  };

  return transaction;
};