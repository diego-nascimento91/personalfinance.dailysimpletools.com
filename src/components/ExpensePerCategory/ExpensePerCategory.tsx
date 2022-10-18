import { ITransaction } from 'assets/interfaces/interfaces';
import { useCategories } from 'assets/state/hooks/useCategories';
import { useUser } from 'assets/state/hooks/useUser';
import { useEffect, useState } from 'react';

interface Props {
  transactions: ITransaction[]
}
const ExpensePerCategory = (props: Props) => {
  const { transactions } = props;

  const [user,] = useUser();
  const [categories,] = useCategories();
  const [totalsCategories, setTotalsCategories] = useState<(string | number)[][]>([]);

  useEffect(() => {
    if (user) handleGetTotalPerCategory();

  }, [user, categories, transactions]);

  const handleGetTotalPerCategory = () => {
    const totalOfEachCategory = getTotalPerCategory();
    setTotalsCategories(totalOfEachCategory);
  };

  const getTotalPerCategory = () => {
    const totalOfCategories = new Array(0);
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
          totalOfCategories.push([category.value, totalCategory]);
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