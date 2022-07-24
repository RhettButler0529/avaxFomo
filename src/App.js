import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from './app.module.css';
import HeaderNav from './components/Header/headerNav'
import Bodytitle from './components/Bodytitle';
import FSM from './components/FSM';
import Total from './components/Total';
import Withdraw from './components/Withdraw';
import Refferals from './components/Refferals';
import Deposit from './components/Deposit';
import Message from './components/Header/message';
// import { BrowserRouter, Switch, Route,} from 'react-router-dom';
import Web3 from 'web3';
import axios from 'axios';
import ArcContractABI from './contract/ArcContract_abi.json';
import ArcTokenABI from './contract/ArcToken_abi.json';
import { addressSet } from './constant/addressSet';

import TradeContext from './context/TradeContext';
import { UseWalletProvider, useWallet } from 'use-wallet';
import TransakSDK from "@transak/transak-sdk";
import { ethers } from "ethers";
import * as config from './config';
import { useLocation } from 'react-router-dom';
import queryString, { parse } from 'query-string';
import Invest from './components/Invest';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TokenStakePage from './pages/TokenStakePage';
// import { CodeSandboxCircleFilled } from '@ant-design/icons';
// import { setDefaultLocale } from 'react-datepicker';

const plans = [
  [7, 140, "Striker", "Any Time", '/img/pirate1.png', 8],
  [11, 203.5, "Navigator", "Any Time", '/img/pirate2.png', 10],
  [15, 255, "Carpenter", "Any Time", '/img/pirate3.png', 12],
  [19, 294.5, "Boatswain", "Any Time", '/img/pirate4.png', 14],
  [23, 322, "Quartermaster", "Any Time", '/img/pirate5.png', 16],
  [27, 337.5, "Captain", "Any Time", '/img/pirate6.png', 18]
];

function App(props) {
  const location = useLocation();

  const handleQueryString = useLocation().search;
  const [walletAddress, setWalletAddress] = React.useState("");
  const [web3Instance, setWeb3Instance] = React.useState(null);
  const [balance, setBalance] = React.useState(0);
  const [contract, setContract] = React.useState(null);
  const [tokenContract, setTokenContract] = React.useState(null);
  const [account, setAccount] = React.useState('');
  const [depositHistory, setDepositHistory] = React.useState([]);
  const [stakedAmount, setStakedAmount] = React.useState(0);
  const [withdrawalAmount, setWithdralAmount] = React.useState(0);
  const [totalReferralWithdrawn, setTotalReferralWithdrawn] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [referralEarned, setReferralEarned] = React.useState(0);
  const [coinPriceByUsd, setCoinPriceByUsd] = React.useState(0);
  const [totalReferralBonus, setTotalReferralBonus] = React.useState(0);
  const [totalStaked, setTotalstaked] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [referrer, setReferrer] = React.useState("");
  const [usersInvited, setUsersInvited] = React.useState("");
  const [userTotalDeposit, setUserTotalDeposit] = React.useState(0);
  const [userTotalDepositReward, setUserTotalDepositReward] = React.useState(0);
  const [walletBtnText, setWalletBtnText] = React.useState("Connect Wallet");
  const [pageName, setPageName] = React.useState(location?.pathname);
  const [stakingPercent, setStakingPercent] = React.useState(8);
  const [approved, setApproved] = React.useState(false);
  const [tokenAllowanceAmount, setTokenAllowanceAmount] = React.useState(0);
  const [tokenBalance, setTokenBalance] = React.useState(0);
  const [upgradeStakePercent, setUpgradeStakePercent] = React.useState(0);
  const [compoundEarning, setCompoundEarning] = React.useState(0);
  const [totalLockedAmount, setTotalLockedAmount] = React.useState(0);
  const [totalClaimedAmount, setTotalClaimedAmount] = React.useState(0);
  const [arcEarning, setArcEarning] = React.useState(0);

  const resetAll = () => {
    setBalance(0);
    setContract(null);
    setTokenContract(null);
    setAccount('');
    setDepositHistory([]);
    setStakedAmount(0);
    setWithdralAmount(0);
    setTotalReferralWithdrawn(0);
    setTotalAmount(0);
    setReferralEarned(0);
    setTotalReferralBonus(0);
    setTotalstaked(0);
    setTotalUsers(0);
    setReferrer("");
    setUserTotalDeposit(0);
    setUserTotalDepositReward(0);
    setStakingPercent(8);
    setTokenBalance(0);
  }

  const notify = (msg) => toast.error(msg, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const settings = {
    apiKey: 'e5736e04-4b3f-429a-919d-28ef20c6f64e',  // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    defaultCryptoCurrency: 'BNB',
    themeColor: '#242222', // App theme color
    hostURL: window.location.origin,
    widgetHeight: "600px",
    widgetWidth: "400px",
  }

  React.useEffect(() => {
    const effect = async () => {
      await loadWeb3();
      await convert2USD();
      // await getBalance();
      // await getUserDepositInfo();
      const referrer = queryString.parse(handleQueryString).ref ?? '';
      setReferrer(referrer);
    }
    effect();
  }, []);

  React.useEffect(() => {
    const effect = async () => {
      let _contract = await loadContract();
      setContract(_contract);

      let _tokenContract = await loadTokenContract();
      setTokenContract(_tokenContract);
    }
    effect();
  }, [account, web3Instance]);

  React.useEffect(() => {
    const effect = async () => {
      /** Get contract balance */
      if (!contract) {
        return;
      }
      await contract.methods.getContractBalance().call()
        .then(res => {
          setTotalAmount(window.web3.utils.fromWei(res.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        })

      if (!account || !web3Instance) {
        return;
      }

      let _history = [];
      await contract.methods.getUserAmountOfDeposits(account).call()
        .then(async (res) => {
          for (let i = 0; i < res; i++) {
            await contract.methods.getUserDepositInfo(account, i).call()
              .then(res => {
                _history.push(res);
              })
              .catch(err => {
                console.log(err);
              })
          }
        })
        .catch(err => {
          console.log(err);
        });
      setDepositHistory(_history);

      await contract.methods.getUserTotalDeposits(account).call()
        .then(_stakedAmount => {
          setStakedAmount(window.web3.utils.fromWei(_stakedAmount.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        });

      await contract.methods.getUserDividends(account).call()
        .then(res => {
          setWithdralAmount(window.web3.utils.fromWei(res.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        })

      // get user withdrawan
      await contract.methods.getUserReferralWithdrawn(account).call()
        .then(res => {
          setTotalReferralWithdrawn(window.web3.utils.fromWei(res.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        })

      // get user referral earned
      await contract.methods.getUserReferralTotalBonus(account).call()
        .then(res => {
          setReferralEarned(window.web3.utils.fromWei(res.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        })

      //get total invited users
      await contract.methods.getUserReferrer(account).call()
        .then(res => {
          setUsersInvited(res);
        })
        .catch(err => {
          console.log(err);
        })

      // get totalrefbonus
      await contract.methods.totalRefBonus().call()
        .then(res => {
          setTotalReferralBonus(window.web3.utils.fromWei(res.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        })

      // get total staked
      await contract.methods.totalStaked().call()
        .then(res => {
          setTotalstaked(window.web3.utils.fromWei(res.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        })

      // get total totalPirates
      await contract.methods.totalPirates().call()
        .then(res => {
          setTotalUsers(res);
        })
        .catch(err => {
          console.log(err);
        })
      // get balance
      await getBalance();

      // get user Total Crew Members = getUserTotalDeposits
      await contract.methods.getUserTotalDeposits(account).call()
        .then((_stakedAmount) => {
          setUserTotalDeposit(window.web3.utils.fromWei(_stakedAmount.toString(), 'ether'));
        })

      // get user Total Crew Rewards = 
      await contract.methods.getUserDividends(account).call()
        .then(res => {
          setUserTotalDepositReward(window.web3.utils.fromWei(res.toString(), 'ether'));
        })
        .catch(err => {
          console.log(err);
        })
      
      // get staking percent
      await contract.methods.stakingPercent(account).call()
      .then(res=>{
        console.log('stakingPercent ===========', res);
        setStakingPercent(Math.max(8, Number(res)));
      })
      .catch(err=>{
        console.log('stakingPercent err===>', err);
      })
      
      // get balance of token
      await tokenContract.methods.balanceOf(account).call()
      .then(res=>{
        setTokenBalance(window.web3.utils.fromWei(res.toString(), 'ether'));
      })
      .catch(err=>{
        console.log('get token balance err', err);
      })

      // getUpgradeStakingPercentPrice
      await contract.methods.getUpgradeStakingPercentPrice(account).call()
      .then(res=>{
          setUpgradeStakePercent(window.web3.utils.fromWei(res.toString(), 'ether'));
      })
      .catch(err=>{
        console.log('getUpgradeStakingPercentPrice err', err);
      })

      // calculateEarnings
      await contract.methods.calculateEarnings(account).call()
      .then(res=>{
          setCompoundEarning(window.web3.utils.fromWei(res.toString(), 'ether'));
      })
      .then(err=>{
        console.log('calculateEarnings err', err);
      })

      // totalLockedAmount
      await contract.methods.totalLockedAmount().call()
      .then(res=>{
        setTotalLockedAmount(window.web3.utils.fromWei(res.toString(), 'ether'));
      })
      .catch(err=>{
        console.log('totalLockedAmount err', err);
      })

      // totalClaimedAmount
      await contract.methods.totalClaimedAmount().call()
      .then(res=>{
        console.log('totalClaimedAmount -------', res);
        setTotalClaimedAmount(window.web3.utils.fromWei(res.toString(), 'ether'));
      })
      .catch(err=>{
        console.log('totalClaimedAmount err', err);
      })

      // calculARCEarnings
      await contract.methods.calculARCEarnings(account).call()
      .then(res=>{
          setArcEarning(window.web3.utils.fromWei(res.toString(), 'ether'));
      })
      .catch(err=>{
        console.log('calculARCEarnings err ====', err);
      })

    }
    effect();
    const timer = setInterval(() => {
      effect();
    }, 2000);
    return () => {
      clearInterval(timer);
    }

  }, [contract, account, web3Instance]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      let chainHex = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainHex !== config.network.chainHex) {
        notify('Please change network to ' + config.network.name);
        setWalletBtnText("Wrong network");
        return;
      }

      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      setWeb3Instance(window.web3);
    }
  }

  React.useEffect(() => {
    if(!window.ethereum){
      return;
    }
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('accountsChanged', accounts);
    });

    window.ethereum.on('networkChanged', async (networkId) => {
      console.log('networkChanged', networkId, config.network.chainId);
      if (parseInt(networkId) !== parseInt(config.network.chainId)) {
        console.log('wrong network');
        closeWallet();
      } else {
        console.log('correct network');
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        setWeb3Instance(window.web3);
        await getBalance();
        setWalletBtnText("Connect Wallet");
        await loadContract();
      }
    });
  }, [web3Instance, account]);

  React.useEffect(()=>{
    setPageName(location.pathname);
  }, [])

  const closeWallet = async () => {
    setAccount(null);
    setWeb3Instance(null);
    resetAll();
    setBalance();
    setWalletBtnText("Wrong network");
    setContract(null);
  }

  const loadContract = async () => {
    // if(!web3Instance) {
    //   return null
    // }
    const contractAddress = addressSet._arcContract;
    if (web3Instance) {
      return await new window.web3.eth.Contract(ArcContractABI, contractAddress);
    }
  }

  const loadTokenContract = async () => {
    // if(!web3Instance) {
    //   return null
    // }
    const contractAddress = addressSet._arcToken;
    if (web3Instance) {
      return await new window.web3.eth.Contract(ArcTokenABI, contractAddress);
    }
  }

  const getBalance = async () => {
    // const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
    // const web3 = new Web3(new Web3.providers.HttpProvider());
    // var balance = await web3.eth.getBalance(walletAddress); //Will give value in.
    // balance = web3.toDecimal(balance);
    // console.log(balance);
    var accounts = await window.web3.eth.getAccounts();
    setAccount(accounts[0]);
    let balance = await window.web3.eth.getBalance(accounts[0])
    const ethBalance = window.web3.utils.fromWei(balance, 'ether')
    setBalance(ethBalance);
    // .then(console.log);
  }

  const onInvest = async (amount, refer, plan) => {
    await contract.methods.invest(refer, plan).send({ from: account, value: window.web3.utils.toWei(amount) })
      .then(res => {
      })
      .catch(err => {
        console.log(err);
      });
  }

  const convert2USD = async (value) => {
    const network = {
      name: config.network.name,
      chainId: config.network.chainId,
      ensAddress: null
    };
    const provider = new ethers.providers.Web3Provider(window.ethereum, network)
    const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    const addr = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
    const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider);
    let roundData = await priceFeed.latestRoundData();
    let avaxPrice = parseInt(roundData.answer._hex, 16) / (10 ** 8);
    setCoinPriceByUsd(avaxPrice);

  }
  const stake = async (plan, _value) => {
    let value = window.web3.utils.toWei(_value.toString(), 'ether');
    // const pls = [0,1,2,3,4,5];
    // console.log(value); return;
    let acc = referrer == "" ? account : referrer;
    await contract.methods.recruitPirate(acc, plan).send({ value: value, from: account })
      .then(res => {
      })
      .catch(err => {
        console.log(err)
      })
  }
  const withdraw = async () => {
    await contract.methods.claimLoot().send({ from: account })
      .then(res => {
      })
      .catch(err => {
        console.log(err);
      })
  }

  /** claimARCLoot */
  const claimArcLoot = async()=>{
    await contract.methods.claimARCLoot().send({ from: account })
      .then(res => {
      })
      .catch(err => {
        console.log(err);
      })
  }

  /** Token stake */
  const tokenStake = async(_value) =>{
    let weiVal = window.web3.utils.toWei(_value.toString(), 'ether');
     await contract.methods.stakeTokens(weiVal).send({from: account})
     .then(res=>{})
     .catch(err=>{
       console.log(err);
     })
  }

  /** Token approve */
  const tokenApprove = async(_amount)=>{
    await tokenContract.methods.approve(addressSet._arcContract, window.web3.utils.toWei('100000000000', 'ether')).send({from: account})
    .then(res=>{
        setApproved(true);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  /** upgradeStakingPercents */
  const upgradeStakingPercents = async()=>{
    await contract.methods.upgradeStakingPercents().send({from: account})
    .then(res=>{
    })
    .catch(err=>{
      console.log('upgradeStakingPercents err=======', err);
    })
  }

  /** compoundToken */
  const compoundToken = async()=>{
    await contract.methods.compoundToken().send({from: account})
    .then(res=>{
    })
    .catch(err=>{
      console.log('compoundToken err=======', err);
    })
  }

  /** withdrawTokens  */
  const withdrawTokens = async()=>{
    await contract.methods.withdrawTokens().send({from: account})
    .then(res=>{
    })
    .catch(err=>{
      console.log('withdrawTokens err=======', err);
    })
  }

  const tokenAllowance = async()=>{
    if(!account || !tokenContract) {
      return;
    }
    await tokenContract.methods.allowance(account, addressSet._arcContract).call()
    .then(res=>{
        setTokenAllowanceAmount(window.web3.utils.fromWei(res.toString(), 'ether'));
    })
    .catch(err=>{
      console.log(err);
    })
  }

  React.useEffect(()=>{
    const effect = async()=>{
      await tokenAllowance();
    }
    effect();
  }, [account, tokenContract, approved])

  const openTransak = () => {
    const transak = new TransakSDK(settings);

    transak.init();
    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data)
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak.close();
    });
  }

  return (
    <UseWalletProvider>
      <TradeContext.Provider value={{ account, setAccount, web3Instance, setWeb3Instance, openTransak, resetAll, notify, walletBtnText }} >
        <ToastContainer />
        <div className={classes.body}>
          <Message />
          <HeaderNav account={account} />
          {
            pageName == "/" &&
            <>
              <Bodytitle amount={totalAmount} usdRate={coinPriceByUsd} />
              <div className={classes.flexRow}>
                <FSM balance={balance} stake={stake} plan={plans[0]} plan_id={0} />
                <FSM balance={balance} stake={stake} plan={plans[1]} plan_id={1} />
                <FSM balance={balance} stake={stake} plan={plans[2]} plan_id={2} />
              </div>
              <div className={classes.flexRow}>
                <FSM balance={balance} stake={stake} plan={plans[3]} plan_id={3} />
                <FSM balance={balance} stake={stake} plan={plans[4]} plan_id={4} />
                <FSM balance={balance} stake={stake} plan={plans[5]} plan_id={5} />
              </div>
              <div className={classes.flexRow}>
                <Total image={"/img/totalrewards.png"} title={"Total Referral Rewards"} quantity={totalReferralBonus * coinPriceByUsd} currency={"USD"} />
                <Total image={"/img/totalstaked.png"} title={"Total Staked"} quantity={totalStaked} currency={"AVAX"} />
                <Total image={"/img/totalusers.png"} title={"Total Pirates"} quantity={totalUsers} />
              </div>
              <div className={classes.flexRow}>
                <Refferals withdrawFunc={withdraw} arcEarning={arcEarning} claimArcLoot={claimArcLoot} amount={stakedAmount} withdrawalAmount={withdrawalAmount} />
                <Withdraw referrer={referrer} account={account} totalReferralWithdrawn={totalReferralWithdrawn} referralEarned={referralEarned} />
              </div>
              <div className={classes.flexRow}>
                <Deposit history={depositHistory} crewMembers={userTotalDeposit} reward={userTotalDepositReward} />
              </div>
            </>
          }
          {
            pageName == "/token-stake" &&
            <TokenStakePage stakingPercent={stakingPercent} 
              account={account}
              tokenApprove={(amount)=>tokenApprove(amount)} 
              tokenStake={(val)=>tokenStake(val)}
              approved={approved}
              tokenAllowanceAmount={tokenAllowanceAmount}
              tokenBalance={tokenBalance}
              upgradeStakePercent={upgradeStakePercent}
              upgradeStakingPercents={()=>upgradeStakingPercents()}
              compoundEarning={compoundEarning}
              compoundToken={compoundToken}
              withdrawTokens={withdrawTokens}
              totalLockedAmount={totalLockedAmount}
              totalClaimedAmount={totalClaimedAmount}
            ></TokenStakePage>
          }
          <div className={classes.footer}>
          </div>
        </div>
      </TradeContext.Provider>
    </UseWalletProvider>
  );
}

export default App;
