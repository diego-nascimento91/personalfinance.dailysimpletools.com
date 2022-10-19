import { OrderByDirection } from 'firebase/firestore';

export type ITransactionType = 'income' | 'expense' | 'other';

export interface ITransaction {
  description: string,
  amount: number
  category: string,
  date: Date,
  account: string,
  note: string,
  publishDate: Date,
  type: ITransactionType;
  id?: string,
}

export interface ICategory {
  description: string
  value: string,
  type: ITransactionType,
  icon: string,
  id?: string,
  ordering?: number
}

export interface IAccounts {
  value: string,
  id?: string,
}

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