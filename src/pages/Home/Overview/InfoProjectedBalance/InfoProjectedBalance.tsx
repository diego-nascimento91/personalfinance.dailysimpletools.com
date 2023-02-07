import Tooltip from '@mui/material/Tooltip';
import styles from './InfoProjectedBalance.module.scss';

const InfoProjectedBalance = () => {
  const tooltipTitle = <p style={{ fontSize: '180%', lineHeight: '1.5rem' }}>The Projected Balance is the final result of the sum of the Current Balance and the total amounts of the credit card accounts and the scheduled transactions of the current month.</p>;

  return (
    <Tooltip 
      arrow
      enterDelay={500} //hover
      leaveDelay={500} //hover
      enterTouchDelay={0} //touch screen
      leaveTouchDelay={4000} //after touch screen
      placement='bottom' 
      title={tooltipTitle} 
    >
      <img src="assets/imgs/info-icon.svg" alt="projected balance information icon" className={styles.infoImg}/>
    </Tooltip>
  );
};

export default InfoProjectedBalance;