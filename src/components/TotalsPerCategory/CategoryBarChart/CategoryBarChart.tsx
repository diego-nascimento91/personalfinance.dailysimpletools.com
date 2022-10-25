import { ITotalsCategories } from 'assets/interfaces/interfaces';
import classNames from 'classnames';
import styles from './CategoryBarChart.module.scss';

interface Props {
  barHeight: number,
  totalCategory: ITotalsCategories
}
const CategoryBarChart = ({ barHeight, totalCategory }: Props) => {

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

  return (
    <div className={styles.barChart__container}>
      <div className={styles['barChart__bar--containerMaxSize']}>
        <div className={styles['barChart__bar--containerRelativeSize']} style={{ height: getHeightPercentage() }}>
          <p className={styles['barChart__bar--amountMoney']}>
            <span className={styles['barChart__bar--amountMoney--moneySign']}>R$ </span>
            <span className={classNames({
              [styles['barChart__bar--amountMoney--moneyText100k']]: totalCategory.total >= 100000
            })}>{getNumberVisual()}</span>
          </p>
          <img className={styles['barChart__bar--icon']} src={totalCategory.icon} alt={`Icon of category ${totalCategory.name}`} />
        </div>
      </div>
      <div className={styles['barChart__categoryName--container']}>
        <p className={styles['barChart__categoryName--text']}>{totalCategory.name}</p>
      </div>
    </div >
  );
};

export default CategoryBarChart;