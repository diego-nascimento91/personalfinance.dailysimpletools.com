import { ITransaction, ITransactionType } from 'assets/interfaces/interfaces';

export const getTransactionDoc = (name: string, transactionType: ITransactionType, amount: number, transactionDate: string, account: string, notes: string,category?: string, transferedTransactionID?: string) => {

  const transaction: ITransaction = {
    description: name,
    type: transactionType,
    amount: amount,
    category: category ? JSON.parse(category).value : 'transfer',
    date: new Date(transactionDate.replace(/-/g, '/')), //replace '-' per '/' makes the date to be created in the user timezone, instead of UTC
    account: JSON.parse(account),
    note: notes,
    publishDate: new Date(),
    transferedTransactionID: transferedTransactionID ? transferedTransactionID : ''
  };

  return transaction;
};