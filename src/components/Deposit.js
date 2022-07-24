
import { useEffect, useState } from 'react';
import classes from './Deposit.module.css'

const planName = "a";

function planToPirates(plan) {
    if(plan === "0") {
        return"Striker";
    }
    if(plan === "1") {
        return"Navigator";
    }
    if(plan === "2") {
        return"Carpenter";
    }
    if(plan === "3") {
        return"Boatswain";
    }
    if(plan === "4") {
        return"Quartermaster";
    }
    if(plan === "5") {
        return "Captain";
    }
}

const Deposit = (props) => {
    const { history } = props;

    const [ myHistory, setMyHistory] = useState([]);

    useEffect(()=>{
        const effect = ()=>{
            let _myHistory = [];
            for(let i = 0; i<history.length; i++) {
                _myHistory.push({...history[i], timestamp: history[i].finish * 1000 - new Date().getTime()});
            }
            setMyHistory(_myHistory);
        }
        effect();
        const timer = setInterval(()=>{
            effect();
        }, 1000);

        return ()=>{
            clearInterval(timer);
        }

    }, [history]);

    const getDateTime = (ms) => {
        let date = new Date(ms);
        // return date.toLocaleTimeString();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let monthStr = month>9? `${month}`:`0${month}`;
        let day = date.getDate();
        let dayStr = day>9?`${day}`:`0${day}`;
        let hours = "0" + date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        return year + "-" + monthStr + "-" + dayStr + " " + hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

    }
    const getTime = (time) => {
        let timestamp = Math.floor(time / 1000);
        let hours = Math.floor(timestamp/3600);
        let mins = "0" + Math.floor((timestamp % 3600)/60);
        let seconds = "0" + (timestamp % 3600) % 60;
        return hours + "h " + mins.substr(-2) + "m " + seconds.substr(-2) + "s";
    }
    return (
        <div className={classes.deposit}>
            <div className={classes.title}>YOUR SHIP CREW</div>
            <div className={classes.total_field}>
                <div className={classes.total_item}>
                        <div className={classes.total_title}>Total Crew Members</div>
                        <div className={classes.total_value}>{Number(props.crewMembers).toFixed(0)}</div>
                </div>
                <div className={classes.total_item}>
                        <div className={classes.total_title}>Total Crew Rewards</div>
                        <div className={classes.total_value}>{Number(props.reward).toFixed(8)} AVAX</div>
                </div>
            </div>
            <div className={"row"}>
                <div className='col-2 text-center'>#</div>
                <div className='col-2 text-center'>Crew Role</div>
                <div className='col-2 text-center'>Amount Staked</div>
                <div className='col-3 text-center'>Duration</div>
                <div className='col-3 text-center'>Countdown</div>
            </div>
            <div className={classes.flexRow}>

            </div>
            <div className={classes.input}>
                {myHistory.map((item, key) =>
                    <div className={"row"} key={key}>
                        <div className='col-2 text-center'>{key + 1}</div>
                        <div className='col-2 text-center'>{planToPirates(item.crewMember)}</div>
                        <div className='col-2 text-center'>{window.web3.utils.fromWei(item.amount, 'ether')} AVAX</div>
                        <div className='col-3 text-center'>{getDateTime(item.finish * 1000)}</div>
                        <div className='col-3 text-center'>{getTime(item.timestamp)}</div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default Deposit;