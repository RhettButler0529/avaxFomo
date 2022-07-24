import * as React from "react";
import classes from './../headerNav.module.css'
// import { useWallet } from 'use-wallet';
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import TradeContext from '../../../context/TradeContext';
import * as config from '../../../config';

const WalletButton = (props) => {
    // const [open, setOpen] = React.useState(false);
    // const wallet = useWallet();
    // const { walletAddress, setWalletAddress, setWeb3Instance, openTransak } = React.useContext(TradeContext);
    const { account, setAccount, setWeb3Instance, resetAll, notify, walletBtnText } = React.useContext(TradeContext);
    const [walletText, setWalletText] = React.useState(walletBtnText);
    const handleClickOpen = () => {
        if (account === "") {
            // setOpen(true);
        } else {
            setAccount("");
            setWeb3Instance(null);
            resetAll();
        }
    }

    const closeWallet = async () => {
        setAccount(null);
        setWeb3Instance(null);
        // setContract(null);
    }

    const connectMetamask = async () => {
        if (window.ethereum) {
            // console.log("loadweb3===========", window.ethereum.networkVersion);
            if (Math.floor(window.ethereum.networkVersion) !== config.network.chainId) {
                notify('Please change network to ' + config.network.name);
                setWalletText("Wrong network");
                return;
            }
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            setWeb3Instance(window.web3);

            let currentAddress = window.ethereum.selectedAddress;
            setAccount(currentAddress);

            window.ethereum.on('accountsChanged', (accounts) => {
                console.log('accountsChanged', accounts);
            });

            window.ethereum.on('networkChanged', (networkId) => {
                // console.log('networkChanged', networkId);
                if (networkId !== config.network.chainId) {
                    closeWallet();
                }else{
                    window.web3 = new Web3(window.ethereum);
                    window.ethereum.enable();
                    setWeb3Instance(window.web3);
        
                    let currentAddress = window.ethereum.selectedAddress;
                    setAccount(currentAddress);
                }
            })
        } else {
            console.log('Please install MetaMask!');
        }
    }

    const getAbbrWalletAddress = (walletAddress) => {
        let abbrWalletAddress = walletAddress.substring(0, 4) + "..." + walletAddress.substring(38, 42);
        return abbrWalletAddress.toUpperCase();
    }

    return (
        <>
            {!account && (
                <button onClick={connectMetamask} className={classes.walletBtn}>
                    <img className={classes.walletImg} src='/img/ship.gif' alt="" />
                    <span className={classes.walletBtn_m}>{walletText}</span>
                </button>
            )}
            {account && (
                <button onClick={handleClickOpen} className={classes.walletBtn}>
                    <img className={classes.walletImg} src='/img/ship.gif' alt="" />
                    <span className={classes.walletBtn_m}>{getAbbrWalletAddress(account)}</span>
                </button>
            )}
        </>
    )
}
export default WalletButton