import WalletConnectProvider from "@walletconnect/web3-provider";
import * as config from '../config';

// const { active, account, library, connector, activate, deactivate } = useWeb3React();
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                [config.network.chainId]: config.network.rpc
            },
            chainId: config.network.chainId
        }
    }
}

export const detectEthereumNetwork = (callback) => {
    window.ethereum.request({ method: 'eth_chainId' }).then(async (chainId) => {
        if (parseInt(chainId) != config.network.chainId) { // bsc testnet
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: config.network.chainHex }], // chainId must be in hexadecimal numbers
            }).then(() => {
                callback();
            })
        } else {
            callback();
        }
    });
}
