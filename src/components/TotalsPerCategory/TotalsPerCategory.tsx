import { useEffect, useState } from 'react';
import { ITotalsCategories, ITransaction, ITransactionType } from 'assets/interfaces/interfaces';
import { useUser } from 'assets/state/hooks/user';
import CategoryBarChart from './CategoryBarChart/CategoryBarChart';
import styles from './TotalsPerCategory.module.scss';
import stylesComponents from 'assets/styles/pageComponents.module.scss';
import { useFilteredCategory, useFilteredTransactionType } from 'assets/state/hooks/transactions';

interface Props {
  transactions: ITransaction[],
  allTransactions?: boolean,
}
const TotalsPerCategory = (props: Props) => {
  const { transactions, allTransactions = false } = props;

  const [user,] = useUser();
  const [totalsCategories, setTotalsCategories] = useState<ITotalsCategories[]>([]);
  const [higherTotal, setHigherTotal] = useState(1);
  const [typeTransaction, setTypeTransaction] = useFilteredTransactionType();
  const [, setFilteredCategory] = useFilteredCategory();

  useEffect(() => {
    if (user) handleGetTotalPerCategory();
  }, [user, transactions, typeTransaction]);

  useEffect(() => {
    setFilteredCategory(null);
  }, []);

  const handleGetTotalPerCategory = () => {
    const totalOfEachCategory = getTotalPerCategory();
    totalOfEachCategory.sort((a, b) => {
      return b.total - a.total;
    });
    setTotalsCategories(totalOfEachCategory);
    if (totalOfEachCategory && totalOfEachCategory.length > 0) {
      setHigherTotal(totalOfEachCategory[0].total);
    }
  };


  const getTotalPerCategory = () => {
    // get unique values of the categories in the transactions
    const allCategories = transactions.filter(item => (item.category?.name !== 'Credit Card Bill')).map(item => {
      return item.category;
    });

    //removing duplicates
    const uniqueCategories = allCategories.filter((category, index, array) => {
      return index === array.findIndex(obj => obj?.id === category?.id);
    });

    const totalOfCategories: ITotalsCategories[] = [];
    if (uniqueCategories.length > 0 && transactions.length > 0) {
      uniqueCategories.forEach(category => {
        const transactionsCategory = transactions.filter(transaction => {
          return transaction.category?.id === category?.id && transaction.type === typeTransaction;
        });
        const pricesTransactionsCategory = transactionsCategory.map(transaction => {
          return +transaction.amount;
        });
        const totalCategory = pricesTransactionsCategory.reduce((previousValue, currentValue) => (previousValue + currentValue), 0);
        if (totalCategory) {
          totalOfCategories.push({
            name: category ? category.name : '',
            total: Math.abs(totalCategory),
          });
        }
      });
    }
    return totalOfCategories;
  };


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
        totalsCategories && totalsCategories.length > 0
          ? (
            <div className={styles.totalsPerCategory__chart}>
              {totalsCategories.map((totalCategory, index) => (index === 0
                ? <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={1} allTransactions={allTransactions} />
                : <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={(totalCategory.total / higherTotal)} allTransactions={allTransactions} />
              ))}
            </div>
          )
          : <span>No transactions added yet</span>
      }
    </section>
  );
};

export default TotalsPerCategory;