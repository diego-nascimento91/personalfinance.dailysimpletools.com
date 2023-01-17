import { OrderByDirection } from 'firebase/firestore';

//Transactions
export type ITransactionType = 'income' | 'expense' | 'other';
export interface ITransaction {
  description: string,
  amount: number,
  category: string,
  date: Date,
  account: string,
  note: string,
  publishDate: Date,
  type: ITransactionType;
  id?: string,
}

// Categories
export interface ICategory {
  description: string,
  value: string,
  type: ITransactionType,
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