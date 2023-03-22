import { Contract, ethers, Wallet } from "ethers"
// import TronWeb from 'tronweb'
import { Dispatch, AnyAction } from "redux"
import ABI from "../../config/ABI"
import { createWalletByMnemonic } from "../../utils"
import { createWalletByPrivateKey, deriveWallet } from "../../utils/wallet"
import Metabit from "../../api/Metabit"
import { ADD_CHILD_WALLET, CHANGE_WALLET, CREATE_WALLET, SET_NETWORK, SET_SELECTED_NETWORK, SET_TOKEN } from "../reducers/walletSlice"
import { ThunkAction, ThunkDispatch } from "@reduxjs/toolkit"

// const engine = WalletEngine.getInstance()
/**
 * 创建root钱包，默认派生btc和eth钱包地址
 * @param mnemonic 
 * @returns 
 */
export const createWallet = (mnemonic?: string, selected?: boolean): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: any): Promise<void> => {
        const networks: Network[] = getState().wallet.networks
        console.log('networks: ', networks)
        const wallets: HDWallet[] = createWalletByMnemonic(mnemonic)
        dispatch(CREATE_WALLET(wallets))
        if (selected) {
            const wallet = wallets[1]  // 默认选择 Ethereum 钱包
            dispatch(CHANGE_WALLET(wallet))
            for (let i = 0; i < networks.length; i++) {
                const network = networks[i]
                if (wallet.chain === network.shortName) {
                    dispatch(SET_SELECTED_NETWORK(network))
                }
            }
        }
    }
}

/**
 * 派生子钱包
 * @param wallet 
 * @param coinType 
 * @returns 
 */
export const addChildWallet = (wallet: HDWallet, chain: string) => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const children: HDWallet[] = getState().wallet.wallets.filter((item: HDWallet) => item.parentId === wallet.id)
        let index = 0
        if (children && children.length) {
            const indexes = children.filter((item: HDWallet) => item.chain === chain).map((item: HDWallet) => item.index)
            if (indexes && indexes.length) {
                const maxIndex = Math.max(...indexes)
                index = maxIndex + 1
            }
        }
        const child = deriveWallet(wallet, chain, index)
        dispatch(ADD_CHILD_WALLET([child]))
    }
}

/**
 * 根据私钥导入特定币种钱包
 * @param privateKey 
 * @param chain 
 * @returns 
 */
export const importWalletByPrivateKey = (privateKey: string, chain: string, selected?: boolean) => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const networks: Network[] = getState().wallet.networks
        const wallets: HDWallet[] = getState().wallet.wallets.filter((item: HDWallet) => item.type !== -1 && !item.parentId && item.chain === chain)
        let index = 0
        if (wallets && wallets.length) {
            const maxIndex = Math.max(...wallets.map((item: HDWallet) => item.index))
            index = maxIndex + 1
        }
        const wallet: HDWallet = createWalletByPrivateKey(privateKey, chain, index)
        dispatch(CREATE_WALLET([wallet]))
        if (selected) {
            dispatch({
                type: CHANGE_WALLET,
                payload: wallet
            })
            for (let i = 0; i < networks.length; i++) {
                const network = networks[i]
                if (wallet.chain === network.shortName) {
                    dispatch(SET_SELECTED_NETWORK(network))
                }
            }
        }
    }
    
}

export const changeWallet = (wallet: HDWallet) => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const networks: Network[] = getState().wallet.networks
        dispatch({
            type: CHANGE_WALLET,
            payload: wallet
        })
        for (let i = 0; i < networks.length; i++) {
            const network = networks[i]
            if (wallet.chain === network.shortName) {
                dispatch(SET_SELECTED_NETWORK(network))
            }
        }
    }
}

/**
 * 添加token
 * @param token 
 * @returns 
 */
export const addToken = (token: ContractToken) => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const tokens: ContractToken[] = getState().wallet.tokens
        const symbolNetworks: string[] = tokens.map(item => item.symbol + item.network)
        if (!symbolNetworks.includes(token.symbol + token.network)) {
            // dispatch(ADD_TOKEN(token))
        }
    }
}

/**
 * 删除token
 * @param token 
 * @returns 
 */
export const delToken = (token: ContractToken) => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const tokens: ContractToken[] = getState().wallet.tokens
        const list = tokens.filter(item => (item.symbol + item.network) != (token.symbol + token.network))
        // dispatch({ type: DEL_TOKEN, payload: list })
    }
}

/**
 * 设置token
 * @param token 
 * @returns 
 */
export const setToken = (token: ContractToken) => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const tokens: ContractToken[] = getState().wallet.tokens
        for (let i = 0; i < tokens.length; i++) {
            if ((token.symbol + token.network) === (tokens[i].symbol + tokens[i].network)) {
                tokens[i].isSelect = true
            }
        }
        dispatch(SET_TOKEN(tokens))
    }
}

/**
 * 获取token
 * @param tokenList 
 * @returns 
 */
export const getTokens = () => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const tokens: ContractToken[] = getState().wallet.tokens
        const tokenKeys = tokens.map(item => item.symbol + item.network)
        Metabit.getContractTokens().then(res => {
            const tokenList = res.data.data as ContractToken[]
            for (let i = 0; i < tokenList.length; i++) {
                if (tokenList[i].address === '0x0') {
                    tokenList[i].isSelect = true
                }
                if (!tokenKeys.includes(tokenList[i].symbol + tokenList[i].network)) {
                    tokens.push(tokenList[i])
                }
            }
            // tokens.sort(compare('sort'))
            dispatch(SET_TOKEN(tokens))
        })
    }
}

function compare(p: string){ //这是比较函数
    return function(m: any, n: any) {
        const a = m[p]
        const b = n[p]
        return a - b  //升序
    }
}

/**
 * 获取网络
 * @returns 
 */
export const getNetworks = () => {
    return (dispatch: Dispatch<AnyAction>, getState: any) => {
        const networks: Network[] = getState().wallet.networks
        const selectedNetwork: Network = getState().wallet.selectedNetwork
        const networkNames: string[] = networks.map(item => item.shortName)
        Metabit.getNetworks().then(res => {
            const networkList = res.data.data as Network[]
            for (let i = 0; i < networkList.length; i++) {
                const network = networkList[i]
                if (!networkNames.includes(network.shortName)) {
                    networks.push(network)
                } else {
                    for (let j = 0; j < networks.length; j++) {
                        if (networks[j].shortName === network.shortName) {
                            networks[j].apiUrl = network.apiUrl
                        }
                    }
                }
            }
            dispatch(SET_NETWORK(networks))
            if (!selectedNetwork || !selectedNetwork.name) {
                dispatch(SET_SELECTED_NETWORK(networks[0]))
            }
        })
    }
}

export const setNetworkType = (network: Network) => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch(SET_SELECTED_NETWORK(network))
    }
}

export const getBalance = (cb?: () => void) => {
    return async (dispatch: Dispatch<AnyAction>, getState: any) => {
        const selectedNetwork: Network = getState().wallet.selectedNetwork
        const selectedWallet: HDWallet = getState().wallet.selectedWallet
        const tokens: ContractToken[] = getState().wallet.tokens
        if (selectedWallet.chain === 'Ethereum' && selectedNetwork.hdIndex === 60) {
            const provider = new ethers.providers.JsonRpcProvider(selectedNetwork.apiUrl)
            const wallet = new Wallet(selectedWallet.privateKey, provider)
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].isSelect && tokens[i].network === selectedNetwork.shortName) {
                    if (tokens[i].address === '0x0') {
                        const res = await wallet.getBalance()
                        tokens[i].balance = +ethers.utils.formatEther(res)
                    } else {
                        const contract = new Contract(tokens[i].address, ABI[tokens[i].chainType], provider)
                        const res = await contract.balanceOf(selectedWallet.address)
                        tokens[i].balance = +ethers.utils.formatUnits(res, 'wei') / Math.pow(10, tokens[i].decimals ?? 6)
                    }
                }
            }
        } else if (selectedWallet.chain === 'Tron' && selectedNetwork.hdIndex === 195) {
            // const privateKey = selectedWallet.privateKey.replace(/^(0x)/, '')
            // const tronWeb = new TronWeb({ 
            //     fullHost: selectedNetwork.apiUrl, 
            //     solidityNode: selectedNetwork.apiUrl, 
            //     privateKey 
            // })
            // for (let i = 0; i < tokens.length; i++) {
            //     if (tokens[i].isSelect && tokens[i].network === selectedNetwork.shortName) {
            //         if (tokens[i].address === '0x0') {
            //             const res = await tronWeb.trx.getUnconfirmedBalance(selectedWallet.address)
            //             tokens[i].balance = +tronWeb.fromSun(res)
            //         } else {
            //             const contract = await tronWeb.contract(ABI[tokens[i].chainType], tokens[i].address)
            //             const res = await contract.balanceOf(selectedWallet.address).call()
            //             tokens[i].balance = tronWeb.fromSun(res.toString())
            //         }
            //     }
            // }
        }
        dispatch(SET_TOKEN(tokens))
        cb && cb()
    }
}