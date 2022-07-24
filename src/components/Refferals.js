
import classes from './Refferals.module.css'
import { FcCurrencyExchange } from "react-icons/fc";

const Refferals = (props) => {
    const { withdrawFunc, amount, withdrawalAmount, arcEarning, claimArcLoot } = props;
    return (
        <div className={classes.flexCol}>
            <div className={classes.title}>CLAIM</div>
            <div className={classes.refferals} style={{height: 'auto'}}>
                <div className={classes.name}>STAKED AVAX</div>
                <div className={classes.avax_value}>{amount} AVAX</div>
                {/* <div className={classes.bonus}>Hold Bonus</div>
                <div className={classes.bonus_value}>3% BONUS</div> */}
                <div className={classes.input}>
                    <div className={classes.input_name}>Available AVAX for withdrawal</div>    
                    <div className={classes.input_value}><img className={classes.goldicon} src='/img/gold1.png' alt=''/>{withdrawalAmount ? Number(withdrawalAmount).toFixed(8) : "0"}</div>
                </div>
                <button className={classes.btn} onClick={withdrawFunc}>CLAIM REWARDS</button>

                <div className={classes.input}>
                    <div className={classes.input_name}>Available Token for withdrawal</div>    
                    <div className={classes.input_value}><img className={classes.goldicon} src='/img/gold1.png' alt=''/>{arcEarning ? Number(arcEarning).toFixed(8) : "0"}</div>
                </div>
                <button className={classes.btn} onClick={claimArcLoot}>CLAIM REWARDS</button>
            </div>
        </div>
    )
}
export default Refferals;