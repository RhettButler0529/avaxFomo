import * as React from 'react';
import CountUp from 'react-countup';
import usePrevious from '../userhook/usePrevious';
import classes from './Bodytitle.module.css'

const Bodytitle = ({amount, usdRate}) => {
  let prevAmount = usePrevious(amount);
  let prevUsdRate = usePrevious(usdRate);
  if(amount == 0){
    prevAmount = 0;
  }
  return (
    <div className={classes.body}>
        <div className={classes.logomax}>
        <img className={classes.hdlogo} src='/img/logohd.png' alt=''/>
        </div>
        <div className={classes.text}>Earn $AVAX by staking on the Ocean Arctic's most terrible ship.</div>
        <div className={classes.total}>
            Total Value Locked
            <span className={classes.total_price}>$ 
                <span className={classes.total_price}>
                <CountUp start={prevAmount * prevUsdRate} end={amount * usdRate} duration={3} decimals={0} separator={','} />
                </span>
            </span>
            {/* <img src="/img/1 (1).png" className={classes.img1} />
            <img src="/img/2 (1).png" className={classes.img2} /> */}
        </div>
    </div>
  );
};

export default Bodytitle;
