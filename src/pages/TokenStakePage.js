import { useState } from 'react';
import parentClasses from '../app.module.css';
import classes from './TokenStake.module.css';
const TokenStakePage = (props) => {
    const {
        stakingPercent,
        tokenStake,
        tokenApprove,
        approved,
        tokenAllowanceAmount,
        account,
        tokenBalance,
        upgradeStakePercent,
        upgradeStakingPercents,
        compoundEarning,
        compoundToken,
        withdrawTokens,
        totalLockedAmount,
        totalClaimedAmount
    } = props;
    const [stakeAmount, setStakeAmount] = useState(0);
    const handleChange = (event) => {
        let name = event.target.name;
        let val = event.target.value;
        if (name == "stakeAmount") {
            setStakeAmount(val);
        }
    }

    return <>
        <div className={parentClasses.flexRow}>
            <div className={classes.ftm} style={{ margin: 'auto' }}>
                <div className={classes.header}>
                    STAKING
                </div>
                <div className={classes.body}>
                    <div className={classes.body_item}>
                        <div className={classes.text}>Daily Earnings</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{stakingPercent}%</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>APR</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{stakingPercent * 365}%</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>Max Daily Earnings</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{15}%</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>Max APR</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{15 * 365}%</div>
                    </div>

                    <div className={classes.amount}>
                        <div className={classes.flexRow}>
                            <div className={classes.amount_name}>Amount: </div>
                            <div className={classes.balance}>Wallet Balance: {Number(tokenBalance).toFixed(8)} tokens</div>
                        </div>
                        <div className={classes.amount_value}>
                            <img className={classes.goldicon} src='/img/gold1.png' alt='' />
                            <input className={classes.deposit_input} type='number' step={1} name="stakeAmount" value={stakeAmount} onChange={handleChange} />
                        </div>
                    </div>
                    <div className={parentClasses.flexRow} style={{ padding: '0px' }}>
                        <div className={classes.deposit_field}>
                            <button className={classes.deposit_btn} disabled={Number(tokenAllowanceAmount) > Number(stakeAmount) || !account}

                                onClick={() => tokenApprove(stakeAmount)}>APPROVE</button>
                        </div>
                        <div className={classes.deposit_field}>
                            <button className={classes.deposit_btn} disabled={Number(stakeAmount)<= 0 || Number(stakeAmount) > Number(tokenBalance) || !account} onClick={() => tokenStake(stakeAmount)}>STAKE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={parentClasses.flexRow}>
            <div className={classes.ftm} style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className={classes.header}>
                    UPGRADE
                </div>
                <div className={classes.body} style={{ backgroundColor: '#00203d' }}>
                    <div className={classes.body_item}>
                        <div className={classes.text}>Current Staking Percent</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{stakingPercent}%</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>Current Staking APR</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{stakingPercent * 365}%</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>Next Staking Percent</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{parseInt(stakingPercent) + 1}%</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>Next Staking APR</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{stakingPercent * 365 + 365}%</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>Upgrade Cost:</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{upgradeStakePercent}%</div>
                    </div>
                </div>
                <div className={classes.deposit_field} style={{ width: '100%' }}>
                    <button className={classes.deposit_btn} onClick={() => upgradeStakingPercents()}>UPGRADE</button>
                </div>
            </div>
            {/* <div className={classes.ftm} style={{width: '4%'}}></div> */}
            <div className={classes.ftm} style={{ width: '48%' }}>
                <div className={classes.header}>
                    COMPOUND
                </div>
                <div className={classes.body}>
                    <div className={classes.body_item}>
                        <div className={classes.text}>Earnings</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{Number(compoundEarning).toFixed(8)}</div>
                    </div>

                    <div className={classes.body_item}>
                        <div className={classes.text}>Fees</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>0%</div>
                    </div>
                    <div className={classes.deposit_field} style={{ width: '100%' }}>
                        <button className={classes.deposit_btn} onClick={() => compoundToken()}>Compound</button>
                    </div>
                </div>
                <div className={classes.header} style={{ marginTop: '10px' }}>
                    CLAIM
                </div>
                <div className={classes.body}>
                    <div className={classes.body_item}>
                        <div className={classes.text}>Earnings</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>{Number(compoundEarning).toFixed(8)}</div>
                    </div>
                    <div className={classes.body_item}>
                        <div className={classes.text}>Fees</div>
                        <div className={classes.line}></div>
                        <div className={classes.number_return}>0%</div>
                    </div>
                    <div className={classes.deposit_field} style={{ width: '100%' }}>
                        <button className={classes.deposit_btn} onClick={() => withdrawTokens()}>CLAIM REWARDS</button>
                    </div>
                </div>
            </div>
        </div>
        <div className={parentClasses.flexRow}>
            <div className={classes.ftm} style={{ width: '48%' }}>
                <div className={classes.header}>
                    TOTAL LOCKED AMOUNT
                </div>
                <div className={classes.header}>
                    {Number(totalLockedAmount).toFixed(8)} token
                </div>
            </div>

            <div className={classes.ftm} style={{ width: '48%' }}>
                <div className={classes.header}>
                    TOTAL CLAIMED AMOUNT
                </div>
                <div className={classes.header}>
                    {Number(totalClaimedAmount).toFixed(8)} token
                </div>
            </div>

        </div>

    </>
        ;
};

export default TokenStakePage;