export interface ITransaction {
  description: string,
  price: string
  category: string,
  date: Date,
  payment: string,
  note: string,
  type: string,
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
  id?: string,
  ordering?: number
}