
import classes from './Withdraw.module.css'
import { BiCopy } from "react-icons/bi";
import { useEffect, useState } from 'react';

// new Clipboard('#referral');
const message = `${window.location.protocol}//${window.location.host}/?ref=`;

const Withdraw = (props) => {

    const [isCopied, setCopied] = useState(false);
    const onCopy = ()=>{
        navigator.clipboard.writeText(message + props.account);
        setCopied(true);
    }

    useEffect(()=>{
        if(!isCopied) return;
        setTimeout(()=>{
            setCopied(false);
        }, 5000);
    }, [isCopied])

    const { totalReferralWithdrawn } = props;
    return (
        <div className={classes.flexCol}>
            <div className={classes.header_title}>REFERRAL</div>
            <div className={classes.withdraw}>
                <div className={classes.text}>You will receive: 5% from each level 1 referral deposits, 3% from each level 2 referral deposits, 2% from each level 3 referral deposits</div>
                <div className={classes.total_field}>
                    <div className={classes.total_item}>
                        <div className={classes.total_title}>Total Referral Earned</div>
                        <div className={classes.total_value}>{props.referralEarned} AVAX</div>
                    </div>
                    <div className={classes.total_item}>
                        <div className={classes.total_title}>Total Referral Withdrawn</div>
                        <div className={classes.total_value}>{props.totalReferralWithdrawn} AVAX</div>
                    </div>
                    {/* <div className={classes.total_item}>
                        <div className={classes.total_title}>Total Users Invited</div>
                        <div className={classes.total_value}>{props.totalInvited ?? 3}</div>
                    </div> */}
                </div>
                <div className={classes.url}>
                    <div className={classes.input} id="referral"> {message + props.account}</div>
                    {isCopied && <span className={classes.text_copy}>Copied</span>}
                    <div className={classes.icon} data-clipboard-text={ message } 
                    style={{cursor: "pointer"}} onClick={onCopy}><BiCopy /></div>
                </div>
                <div className={classes.footer_text}>Note: You need to have at least 1 deposit to start receive earnings</div>
            </div>
        </div>
    )
}
export default Withdraw;