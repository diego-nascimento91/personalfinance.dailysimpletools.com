import { useEffect, useState } from 'react';
import { ITotalsCategories, ITransaction } from 'assets/interfaces/interfaces';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import CategoryBarChart from './CategoryBarChart/CategoryBarChart';
import styles from './TotalsPerCategory.module.scss';

interface Props {
  transactions: ITransaction[],
  allTransactions?: boolean,
}
const TotalsPerCategory = (props: Props) => {
  const { transactions, allTransactions = false } = props;

  const [user,] = useUser();
  const [categories,] = useCategories();
  const [totalsCategories, setTotalsCategories] = useState<ITotalsCategories[]>([]);
  const [higherTotal, setHigherTotal] = useState(1);
  const [typeTransaction, setTypeTransaction] = useState('expense');

  useEffect(() => {
    if (user) handleGetTotalPerCategory();
  }, [user, categories, transactions, typeTransaction]);

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
    const totalOfCategories: ITotalsCategories[] = [];
    if (categories && categories.length > 0 && transactions.length > 0) {
      categories.forEach(category => {
        const transactionsCategory = transactions.filter(transaction => {
          return transaction.category === category.value && transaction.type === typeTransaction;
        });
        const pricesTransactionsCategory = transactionsCategory.map(transaction => {
          return +transaction.amount;
        });
        const totalCategory = pricesTransactionsCategory.reduce((previousValue, currentValue) => (previousValue + currentValue), 0);
        if (totalCategory) {
          totalOfCategories.push({
            name: category.value,
            total: totalCategory,
            icon: category.icon
          }
          );
        }
      });
    }
    return totalOfCategories;
  };


  return (
    <section className={`theme__homesections ${styles.totalsPerCategory__container}`}>
      <label className={styles.totalsPerCategory__typeTransactionLabel}>
        <select 
          value={typeTransaction} 
          className={styles.totalsPerCategory__typeTransactionSelect}
          onChange={e => setTypeTransaction(e.target.value)}
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
              {totalsCategories.map((totalCategory, index) => {
                if (index === 0) {
                  return <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={1} allTransactions={allTransactions}/>;
                } else {
                  return <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={(totalCategory.total / higherTotal)}  allTransactions={allTransactions}/>;
                }
              })}
            </div>
          )
          : <span>No transactions added yet</span>
      }
    </section>
  );
};

export default TotalsPerCategory;