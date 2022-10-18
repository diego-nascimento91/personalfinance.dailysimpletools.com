export interface ITransaction {
  description: string,
  amount: string
  category: string,
  date: Date,
  account: string,
  note: string,
  publishDate: Date,
  type: string;
  id?: string,
}

export interface IQuery {
  field: string,
  condition: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

export interface ICategory {
  description: string
  value: string,
  type: 'income' | 'expense' | 'other',
  icon: string,
  id?: string,
  ordering?: number
}