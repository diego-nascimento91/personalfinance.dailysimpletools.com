import { OrderByDirection } from 'firebase/firestore';

//Transactions
export type ITransactionType = 'income' | 'expense' | 'transfer';
export interface ITransaction {
  name: string,
  amount: number,
  category: ICategory | null,
  date: Date,
  account: IAccount,
  note: string,
  publishDate: Date,
  type: ITransactionType,
  transferedTransactionID: string,
  id?: string,
}

// Categories
export interface ICategory {
  description: string,
  name: string,
  type: ITransactionType | 'other',
  icon: string,
  id?: string,
  ordering?: number
}
export interface ITotalsCategories {
  name: string,
  total: number,
}

// Accounts
export type IAccountType = 'balance-account' | 'credit-account';
export interface IAccount {
  name: string,
  balance: number,
  type: IAccountType,
  description: string,
  id?: string,
}

// Firebase
export interface IQuery {
  field: string,
  condition: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}
export interface IOrderConfig {
  fieldName: string,
  orderDirection: OrderByDirection
}