
import classes from './Refferals.module.css'
import { FcCurrencyExchange } from "react-icons/fc";
import { useEffect, useState } from 'react';

const Invest = (props) => {
    const { referrer } = props;
    const [amount, setAmount] = useState(0);
    const [plan, setPlan] = useState(0);
    const [myReferrer, setMyReferrer] = useState('');
    
    useEffect(()=>{
        setMyReferrer(referrer.ref??'');
    }, [referrer]);

    const onInputChange = (event)=>{
        const name = event.target.name;
        const val = event.target.value;
        if(name == "amount") {
            setAmount(val);
        }
        if(name == "referrer") {
            setMyReferrer(val);
        }
        if(name == "plan") {
            setPlan(val);
        }
    }

    return (
        <>
        <div className={`${classes.title} col-12`}>Invest</div>
        <div className={"col-12"}>
            <div className={classes.invest}>
                <div className=''>
                    <label className={"p-2"}>Amount: </label><br/>
                    <input type="number" name="amount" className={classes.number} value={amount} onChange={onInputChange}/>
                </div>
                <div className=''>
                    <label className={"p-2"}>Referrer: </label><br/>
                    <input type="input" name="referrer" className={classes.address} value={myReferrer} onChange={onInputChange} />
                </div>
                <div className=''>
                    <label className={"p-2"}>Plan: </label><br/>
                    <input type="number" name="plan" className={classes.number} value={plan} onChange={onInputChange} />
                </div>
                <button className={"btn btn-info"} onClick={()=>props.onInvest(amount, myReferrer, plan)}>Submit</button>
            </div>
        </div>
        </>
        
    )
}
export default Invest;