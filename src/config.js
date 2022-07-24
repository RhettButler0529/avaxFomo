export const env = "local";
// export const env = "prod";

export const mint_price = env=='local' ? 0.001 : 0.001;

export const network = {
    name: env=='local' ? "Avalanche Fuji Testnet" : "Avalanche Mainnet",
    chainId: env=="local" ? 43113 : 43114,
    chainHex: env=="local"? '0xa869' : '0xa86a',
    rpc: env=="local"? "https://api.avax-test.network/ext/bc/C/rpc": "https://api.avax.network/ext/bc/C/rpc",
    currency: "AVAX",
}

export const initAccount =  {
    btnText: 'Connect Wallet',
    address: '',
    balance: 0,
    chainId: env=="local"? 43113 : 43114,
    chainHex: env=="local"? '0xA869' : '0xA86A',
    mainToken: env=="local"? 'AVAX (Avalanche FUJI Testnet)':'Avalanche Network'
}

export const contractAddrs = {
    _avaxfomo: env=="local"?'0xed2046Cc82E36Cee4EcaFDe2Ccd4791e91f5910e':'0x3f73532fEec1036e7DF22ec201B9BAFFDC4b5079',
}