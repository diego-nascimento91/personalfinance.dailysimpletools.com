import { ITotalsCategories } from 'assets/interfaces/interfaces';
import { useFilteredCategory } from 'assets/state/hooks/filterTransactionsHooks';
import { useCategories, useUser } from 'assets/state/hooks/firebaseHooks';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './CategoryBarChart.module.scss';
import stylesImgError from 'assets/styles/imgError.module.scss';

interface Props {
  barHeight: number,
  totalCategory: ITotalsCategories,
  allTransactions: boolean,
}
const CategoryBarChart = ({ barHeight, totalCategory, allTransactions }: Props) => {
  const [user] = useUser();
  const [filteredCategory, setFilteredCategory] = useFilteredCategory();
  const [categories] = useCategories();
  const [imgError, setImgError] = useState(false);
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    if(user) {
      getCategoryURL();
    }
  }, [categories, user]);

  const getHeightPercentage = () => {
    const heightPercentage = (barHeight * 100).toString() + '%';
    return heightPercentage;
  };

  const getNumberVisual = () => {
    let numberVisual: string;
    if (totalCategory.total < 100) {
      numberVisual = (totalCategory.total).toFixed(2);
    } else if (totalCategory.total < 10000) {
      numberVisual = ((totalCategory.total).toFixed(0));
    } else if (totalCategory.total < 100000) {
      numberVisual = (totalCategory.total / 1000).toFixed(1) + 'k';
    } else {
      numberVisual = (totalCategory.total).toFixed(2);
    }
    return numberVisual;
  };

  const handleSetFilteredCategory = () => {
    if (totalCategory.name === filteredCategory?.name) {
      setFilteredCategory(null);
      return;
    }
    setFilteredCategory(totalCategory);
  };

  const getCategoryURL = () => {
    const category = categories.find(item => {
      return item.value === totalCategory.name;
    });

    if(category) {
      setImageURL(category.icon);
      return;
    } 
    setImageURL('');
  };

  return (
    <div className={styles.barChart__container}>
      <div className={styles['barChart__bar--containerMaxSize']}>
        <div
          style={{ height: getHeightPercentage() }}
          className={classNames({
            [styles['barChart__bar--containerRelativeSize']]: true,
            [styles['barChart__bar--containerRelativeSizeCursor']]: allTransactions,
            [styles['barChart__bar--containerRelativeSizeNotSelected']]: allTransactions && filteredCategory && totalCategory.name !== filteredCategory.name,
          })}
          onClick={() => { if (allTransactions) handleSetFilteredCategory(); }}
        >
          <p className={styles['barChart__bar--amountMoney']}>
            <span className={classNames({
              [styles['barChart__bar--amountMoney--moneyText100k']]: totalCategory.total >= 100000
            })}>${getNumberVisual()}</span>
          </p>
          {
            imageURL && imageURL.length > 0
              ? (
                <>
                  <img className={styles['barChart__bar--icon']} src={imageURL}
                    onError={({ currentTarget }) => {
                      currentTarget.src = '';
                      currentTarget.className = stylesImgError.imgError;
                      setImgError(true);
                    }}
                  />
                  {imgError && <span className={styles['barChart__bar--iconText']}>{totalCategory.name[0]}</span>}
                </>
              )
              : (
                <span className={styles['barChart__bar--iconText']}>{totalCategory.name[0]}</span>
              )
          }

        </div>
      </div>
      <div className={styles['barChart__categoryName--container']}>
        <p className={styles['barChart__categoryName--text']}>{totalCategory.name}</p>
      </div>
    </div >
  );
};

export default CategoryBarChart;