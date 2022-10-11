export interface ITransaction {
  type: string,
  category: string,
  date: Date,
  description: string,
  id?: string,
  payment: string,
  place: string,
  price: string
}

export interface Query {
  field: string,
  condition: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

export interface Category {
  id: string,
  value: string,
  description: string
}