export interface ITransaction {
  category: string,
  date: Date,
  description: string,
  id?: string,
  payment: string,
  place: string,
  price: string
}