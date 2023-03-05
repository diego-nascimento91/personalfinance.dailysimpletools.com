import { ITransactionType } from 'assets/interfaces/interfaces';

export type FormTypeData = {
  name: string,
  amount: number,
  category: string,
  categoryDescription: string,
  transactionDate: string,
  transactionType: ITransactionType | null,
  account: string,
  accountTo: string,
  notes: string,
  transactionIDFrom: string,
  transactionIDTo: string,
  accountIDFrom: string,
  accountIDTo: string,
}

export type typeTab = 'income-expense' | 'transfer-withdraw'