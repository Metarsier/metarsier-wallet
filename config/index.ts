import { ImageSourcePropType } from "react-native"

export const STATIC_URL = 'https://static.runfast123.com/'

export const MAINNET = 'mainnet'
export const ROPSTEN = 'ropsten'
export const KOVAN = 'kovan'
export const RINKEBY = 'rinkeby'
export const GOERLI = 'goerli'
export const RPC = 'rpc'
export const NO_RPC_BLOCK_EXPLORER = 'NO_BLOCK_EXPLORER'

export const CHAINS = [
	'Ethereum',
	'Tron',
]

export const CHAIN_COINTYPE: {[key: string]: number} = {
	'Ethereum': 60,
	'Polygon': 60,
	'BSC': 60,
	'Tron': 195
}

export const CHAIN_MAP: {[key: string]: ImageSourcePropType} = {
	'Tron': require('../assets/icons/trx.png'),
	'Bitcoin': require('../assets/icons/btc.png'),
	'Ethereum': require('../assets/icons/eth.png'),
	'ETH': require('../assets/icons/eth.png'),
	'TRX': require('../assets/icons/trx.png'),
	'USDT': require('../assets/icons/usdt.png'),
}