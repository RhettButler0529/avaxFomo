import * as React from 'react';
import classes from './FSM.module.css'
import { FcCurrencyExchange } from "react-icons/fc";

const FSM = (props) => {
    const { balance, stake, plan, plan_id } = props;
    const [value, setValue] = React.useState(0);
    const percent = plan[1];
    const duration = plan[0];
    const planName = plan[2];
    const lockedTime = plan[3];
    const imagesPlan = plan[4];
    const daily_earning = (percent/duration);
    const daily_token_earning = plan[5];
    React.useEffect(() => {
    }, []);

    const handleChange = (event) => {
        setValue(event.target.value);
    }
  return (
    <div className={classes.ftm}>
        <div className={classes.header}>
            {/* <img className={classes.header_img} src='/img/FSM.26a08c9ac39524cc989b.png' alt=''/> */}
            <img className={classes.header_img} src={imagesPlan} alt=''/>
            <div className={classes.title_field}>
                <div className={classes.title}> {planName}&nbsp;&nbsp;<span className={classes.usd_price}> {duration} days</span></div>
                <div className={classes.price_name}>
                    Daily AVAX Earnings : 
                    <span className={classes.ftm_value}> {daily_earning}%</span>
                </div>
                <div className={classes.price_name}>
                    Daily Token Earnings : 
                    <span className={classes.ftm_value}> {daily_token_earning}%</span>
                </div>
            </div>
            {/* <div className={classes.price_field}>
                <div className={classes.usd_price}>
                
                
                </div>
            </div> */}
        </div>
        <div className={classes.body}>
            <div className={classes.body_item}>
                <div className={classes.text}>Total AVAX Return</div>
                <div className={classes.line}></div>
                <div className={classes.number_return}>{percent}%</div>
            </div>
            <div className={classes.body_item}>
                <div className={classes.text}>In {duration} days you will get</div>
                <div className={classes.line}></div>
                <div className={classes.number}>{ value ? Number(value * percent / 100).toFixed(1) : "0"} AVAX</div>
            </div>

            <div className={classes.body_item}>
                <div className={classes.text}>Total Token Return</div>
                <div className={classes.line}></div>
                <div className={classes.number_return}>{daily_token_earning * duration}%</div>
            </div>

            <div className={classes.body_item}>
                <div className={classes.text}>Withdrawal</div>
                <div className={classes.line}></div>
                <div className={classes.number}>{lockedTime}</div>
            </div>
            <div className={classes.amount}>
                <div className={classes.flexRow}>
                    <div className={classes.amount_name}>Amount: </div>    
                    <div className={classes.balance}>Wallet Balance: { balance ? Number(balance).toFixed(2) : "0"} AVAX</div>
                </div>
                <div className={classes.amount_value}>
                <img className={classes.goldicon} src='/img/gold1.png' alt=''/>
                    <input className={classes.deposit_input} type='number' step={1} value={value} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.deposit_field}>
                <button className={classes.deposit_btn} onClick={() => stake(plan_id, value)}>STAKE</button>
            </div>
        </div>
    </div>
  );
};

export default FSM;
