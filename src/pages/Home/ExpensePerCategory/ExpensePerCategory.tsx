import { useCategories } from 'assets/state/hooks/useCategories';
import { useTransactionsMonth } from 'assets/state/hooks/useTransactionsMonth';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';

const ExpensePerCategory = () => {
  const [user,] = useUser();
  const [transactionsMonth,] = useTransactionsMonth();
  const [categories,] = useCategories();
  const [totalsCategories, setTotalsCategories] = useState<(string | number)[][]>([]);

  useEffect(() => {
    if (user) handleGetTotalPerCategory();

  }, [user, categories, transactionsMonth]);

  const handleGetTotalPerCategory = () => {
    const totalOfEachCategory = getTotalPerCategory();
    setTotalsCategories(totalOfEachCategory);
  };

  const getTotalPerCategory = () => {
    const totalOfCategories = new Array(0);
    if (categories && categories.length > 0 && transactionsMonth.length > 0) {
      categories.forEach(category => {
        const transactionsCategory = transactionsMonth.filter(transaction => {
          return transaction.category === category.id && transaction.type !== 'income';
        });
        const pricesTransactionsCategory = transactionsCategory.map(transaction => {
          return +transaction.price;
        });
        const totalCategory = pricesTransactionsCategory.reduce((previousValue, currentValue) => (previousValue + currentValue), 0);
        if (totalCategory) {
          totalOfCategories.push([category.id, totalCategory]);
        }
      });
    }
    return totalOfCategories;
  };


  return (
    <section className="theme__homesections">
      <h2 className="theme__title">Expense per Category</h2>
      <ul>
        {
          totalsCategories && totalsCategories.length > 0
            ? (
              totalsCategories.map(totalCategory => {
                return (
                  <li key={totalCategory[0]}>{totalCategory[0]}: R$ {(totalCategory[1] as number).toFixed(2)}</li>
                );
              })
            )
            : <span>No transactions added yet</span>
        }
      </ul>
    </section>
  );
};

export default ExpensePerCategory;