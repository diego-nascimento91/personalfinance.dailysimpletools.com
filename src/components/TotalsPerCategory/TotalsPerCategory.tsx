import { useEffect } from 'react';
import { ITransaction, ITransactionType } from 'utils/interfaces';
import CategoryBarChart from './CategoryBarChart/CategoryBarChart';
import styles from './TotalsPerCategory.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import { useTransactionsFilter_byCategory, useTransactionsFilter_byType, useTransactionsTotalsPerCategory } from 'state/hooks/transactions';

interface Props {
  transactions: ITransaction[],
  allTransactions?: boolean,
}
const TotalsPerCategory = (props: Props) => {
  const { allTransactions = false } = props;

  const totals = useTransactionsTotalsPerCategory();
  const [typeTransaction, setTypeTransaction] = useTransactionsFilter_byType();
  const [, setFilteredCategory] = useTransactionsFilter_byCategory();

  useEffect(() => {
    setFilteredCategory(null);
  }, []);


  return (
    <section className={`${stylesComponents.pageComponents} ${styles.totalsPerCategory__container}`}>
      <label className={styles.totalsPerCategory__typeTransactionLabel}>
        <select
          value={typeTransaction}
          className={styles.totalsPerCategory__typeTransactionSelect}
          onChange={e => setTypeTransaction(e.target.value as ITransactionType)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>
      <h2 className="theme__title">{typeTransaction === 'income' ? 'Income' : 'Expense'} per Category</h2>
      {
        totals.totalsPerCategory.length > 0
          ? (
            <div className={styles.totalsPerCategory__chart}>
              {totals.totalsPerCategory.map((totalCategory, index) => (index === 0
                ? <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={1} allTransactions={allTransactions} />
                : <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={(totalCategory.total / totals.higherNumber)} allTransactions={allTransactions} />
              ))}
            </div>
          )
          : <span>No transactions added yet</span>
      }
    </section>
  );
};

export default TotalsPerCategory;