import { memo } from 'react';
import classNames from 'classnames';
import styles from './GraphBar.module.scss';



interface Props {
  info?: JSX.Element,
  title: string,
  total: number,
  width: string,
}
const GraphBar = ( props: Props) => {
  const { info, title, total, width } = props;

  return (
    <div className={styles.graphBar}>
      <div className={styles.graphBar__title}>{title} {info}</div>
      <div className={styles.graphBar__bar}>
        <div
          className={styles.graphBar__bar2}
          style={{ width: width }}
        >
          <p className={
            classNames({
              [styles.graphBar__positive]: total >= 0,
              [styles.graphBar__negative]: total < 0
            })}>
            {total >= 0 ? '+' : '-'} $ {Math.abs(total).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default memo(GraphBar);