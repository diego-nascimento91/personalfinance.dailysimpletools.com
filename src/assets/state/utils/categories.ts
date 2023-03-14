import { ITotalsCategories, ITransaction, ITransactionType } from 'assets/interfaces/interfaces';

const categoriesUtils = {
  getTransactionsTotalsPerCategory: (transactions: ITransaction[], typeTransaction: ITransactionType) => {
    // get unique values of the categories in the transactions
    const uniqueCategories = transactions.map(transaction => transaction.category).filter((category, index, array) => {
      return category?.name !== 'Credit Card Bill'
        && index === array.findIndex(obj => obj?.id === category?.id)
        && category?.type === typeTransaction;
    });
  
    const totals: ITotalsCategories[] = [];
    uniqueCategories.forEach(category => {
      if (category) {
        const totalCategory = transactions.reduce((total, transaction) => {
          if (transaction.category?.id === category?.id && transaction.type === typeTransaction) {
            return total + transaction.amount;
          }
          return total;
        }, 0);
  
        totals.push({
          name: category.name,
          total: Math.abs(totalCategory),
        });
      }
    });
    totals.sort((a, b) => (b.total - a.total));
  
    return {
      higherNumber: totals.length > 0 ? totals[0].total : 0,
      totalsPerCategory: totals
    };
  }
};

export default categoriesUtils;
 