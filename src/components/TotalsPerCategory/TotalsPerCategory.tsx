import { useEffect, useState } from 'react';
import { ITotalsCategories, ITransaction } from 'assets/interfaces/interfaces';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import CategoryBarChart from './CategoryBarChart/CategoryBarChart';
import styles from './TotalsPerCategory.module.scss';

interface Props {
  transactions: ITransaction[]
}
const TotalsPerCategory = (props: Props) => {
  const { transactions } = props;

  const [user,] = useUser();
  const [categories,] = useCategories();
  const [totalsCategories, setTotalsCategories] = useState<ITotalsCategories[]>([]);
  const [higherTotal, setHigherTotal] = useState(1);

  useEffect(() => {
    if (user) handleGetTotalPerCategory();
  }, [user, categories, transactions]);

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
          return transaction.category === category.value && transaction.type !== 'income';
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
    <section className="theme__homesections">
      <h2 className="theme__title">Expense per Category</h2>
      {
        totalsCategories && totalsCategories.length > 0
          ? (
            <div className={styles.totalsPerCategory__chart}>
              {totalsCategories.map((totalCategory, index) => {
                if (index === 0) {
                  return <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={1} />;
                } else {
                  return <CategoryBarChart key={totalCategory.name} totalCategory={totalCategory} barHeight={(totalCategory.total / higherTotal)} />;
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