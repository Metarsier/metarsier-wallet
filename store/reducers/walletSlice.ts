import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import Decimal from "decimal.js-light"
import { Contract, ethers, Wallet } from "ethers"
import TronWeb from "tronweb"
import lodash from 'lodash'
import { RootState } from ".."
import Metabit from "../../api/Metabit"
import ABI from "../../config/ABI"
import { createWalletByMnemonic } from "../../utils"
import { createWalletByPrivateKey, deriveWallet } from "../../utils/wallet"

export interface WalletState {
    wallets: HDWallet[],
    selectedWallet: HDWallet,
    selectedNetwork: Network,
    networks: Network[],
    tokens: ContractToken[]
}

const initialState: WalletState = {
    wallets: [],
    selectedWallet: {} as HDWallet,
    selectedNetwork: {} as Network,
    networks: [],
    tokens: []
}

export const getTokens = createAsyncThunk(
    'wallet/getTokens',
    async () => {
      const res = await Metabit.getContractTokens()
      return res.data.data as ContractToken[]
    }
)

export const getNetworks = createAsyncThunk(
    'wallet/getNetworks',
    async () => {
      const res = await Metabit.getNetworks()
      return res.data.data as Network[]
    }
)

export const createWallet = createAsyncThunk(
    'wallet/createWallet',
    async ({ mnemonic, selected }: CreateWalletParams, thunkAPI) => {
        const rootState = thunkAPI.getState() as RootState
        const wallets = await createWalletByMnemonic(rootState.wallet.wallets, mnemonic)
        return { wallets, selected } as CreateWalletPayload
    }
)



export const getBalance = createAsyncThunk(
    'wallet/getBalance',
    async (cb: () => void = () => null, thunkAPI) => {
        console.log('getBalance start: ')
        const rootState = thunkAPI.getState() as RootState
        const selectedNetwork: Network = rootState.wallet.selectedNetwork
        const selectedWallet: HDWallet = rootState.wallet.selectedWallet
        const tokens: ContractToken[] = lodash.sortBy(rootState.wallet.tokens, ['sort'])
        console.log('api: ', selectedNetwork.api)
        if (selectedWallet.chain === 'Ethereum' && selectedNetwork.chainType === 60) {
            const provider = new ethers.providers.JsonRpcProvider(selectedNetwork.api)
            const handlers: HandlerGetBalance[] = []
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].isSelect && tokens[i].network === selectedNetwork.shortName) {
                    console.log(tokens[i].network)
                    if (tokens[i].address === '0x0') {
                        const wallet = new Wallet(selectedWallet.privateKey, provider)
                        handlers.push({index: i, func: wallet.getBalance()})
                    } else {
                        const contract = new Contract(tokens[i].address, ABI[tokens[i].chainType], provider)
                        handlers.push({index: i, func: contract.balanceOf(selectedWallet.address)})
                    }
                }
            }
            const funcs = handlers.map((item: HandlerGetBalance) => item.func)
            const res = await Promise.all(funcs)
            if (res && res.length && Array.isArray(res)) {
                for (let i = 0; i < handlers.length; i++) {
                    if (i === 0) {
                        tokens[handlers[i].index].balance = +ethers.utils.formatEther(res[i])
                    } else {
                        const wei = ethers.utils.formatUnits(res[i], 'wei')
                        tokens[handlers[i].index].balance = +new Decimal(wei).dividedBy(new Decimal('10').pow(tokens[i].decimals ?? 6)).toFixed(8)
                    }
                }
            }
            
        } else if (selectedWallet.chain === 'Tron' && selectedNetwork.chainType === 195) {
            const privateKey = selectedWallet.privateKey.replace(/^(0x)/, '')
            const apiSplit = selectedNetwork.api.split('.io/')
            const api = apiSplit[0] + '.io'
            const apiKey = apiSplit[1]
            const tronWeb = new TronWeb({ 
                fullHost: api, 
                solidityNode: api, 
                headers: { "TRON-PRO-API-KEY": apiKey },
                privateKey 
            })
            const handlers: HandlerGetBalance[] = []
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].isSelect && tokens[i].network === selectedNetwork.shortName) {
                    if (tokens[i].address === '0x0') {
                        handlers.push({index: i, func: tronWeb.trx.getUnconfirmedBalance(selectedWallet.address)})
                    } else {
                        const contract = await tronWeb.contract(ABI[tokens[i].chainType], tokens[i].address)
                        handlers.push({index: i, func: contract.balanceOf(selectedWallet.address).call()})
                    }
                }
            }
            const funcs = handlers.map((item: HandlerGetBalance) => item.func)
            const res = await Promise.all(funcs)
            if (res && res.length && Array.isArray(res)) {
                for (let i = 0; i < handlers.length; i++) {
                    if (i === 0) {
                        tokens[handlers[i].index].balance = +tronWeb.fromSun(res[i])
                    } else {
                        tokens[handlers[i].index].balance = tronWeb.fromSun(res[i].toString())
                    }
                }
            }
        }
        cb()
        return tokens
    }
)

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        importWalletByPrivateKey: (state, action: PayloadAction<ImportWalletByPrivateKeyPayload>) => {
            const networks: Network[] = state.networks
            const wallets: HDWallet[] = state.wallets.filter((item: HDWallet) => item.type !== -1 && !item.parentId && item.chain === action.payload.chain)
            let index = 0
            if (wallets && wallets.length) {
                const maxIndex = Math.max(...wallets.map((item: HDWallet) => item.index))
                index = maxIndex + 1
            }
            const wallet: HDWallet = createWalletByPrivateKey(action.payload.privateKey, action.payload.chain, index)
            state.wallets = [ ...state.wallets, wallet ]
            if (action.payload.selected) {
                state.selectedWallet  = wallet
                for (let i = 0; i < networks.length; i++) {
                    const network = networks[i]
                    if (wallet.chain?.toLowerCase() === network.shortName.toLowerCase()) {
                        state.selectedNetwork = network
                    }
                }
            }
        },
        addChildWallet: (state, action: PayloadAction<AddChildWalletPayload>) => {
            const children: HDWallet[] = state.wallets.filter((item: HDWallet) => item.parentId === action.payload.wallet.id)
            let index = 0
            if (children && children.length) {
                const indexes = children.filter((item: HDWallet) => item.chain === action.payload.chain).map((item: HDWallet) => item.index)
                if (indexes && indexes.length) {
                    const maxIndex = Math.max(...indexes)
                    index = maxIndex + 1
                }
            }
            const child = deriveWallet(action.payload.wallet, action.payload.chain, index)
            state.wallets = [ ...state.wallets, child ]
        },
        changeWallet: (state, action: PayloadAction<HDWallet>) => {
            const networks: Network[] = state.networks
            const wallet: HDWallet = action.payload
            state.selectedWallet  = wallet
            for (let i = 0; i < networks.length; i++) {
                const network = networks[i]
                if (wallet.chain?.toLowerCase() === network.shortName.toLowerCase()) {
                    state.selectedNetwork = network
                }
            }
        },
        setWalletAlias: (state, action: PayloadAction<SetWalletAliasPayload>) => {
            const id: string = action.payload.id
            const alias: string = action.payload.alias
            for (let i = 0; i < state.wallets.length; i++) {
                if (id === state.wallets[i].id) {
                    state.wallets[i].alias = alias
                }
            }
            state.wallets = [ ...state.wallets ]
        },
        delWallet: (state, action: PayloadAction<DelWalletPayload>) => {
            const id = action.payload.id
            const list: HDWallet[] = state.wallets.filter((item: HDWallet) => {
                if (action.payload.isRoot) {
                    return item.id !== id && item.parentId !== id
                }
                return item.id !== id
            })
            state.wallets = [ ...list ]
            action.payload.callback(list.length === 0)
        },
        clearWallet: (state) => {
            state.wallets = []
            state.networks = []
            state.tokens = []
            state.selectedWallet = {} as HDWallet
            state.selectedNetwork = {} as Network
        },
        selectToken: (state, action: PayloadAction<ContractToken>) => {
            const tokens: ContractToken[] = state.tokens
            const token: ContractToken = action.payload
            for (let i = 0; i < tokens.length; i++) {
                if ((token.symbol + token.network) === (tokens[i].symbol + tokens[i].network)) {
                    tokens[i].isSelect = true
                }
            }
            state.tokens = [ ...tokens ]
        },
        addToken: (state, action: PayloadAction<ContractToken>) => {
            const tokens: ContractToken[] = state.tokens
            const token: ContractToken = action.payload
            const symbolNetworks: string[] = tokens.map(item => item.symbol + item.network)
            if (!symbolNetworks.includes(token.symbol + token.network)) {
                state.tokens = [ ...tokens, token ]
            }
        },
        delToken: (state, action: PayloadAction<ContractToken>) => {
            const tokens: ContractToken[] = state.tokens
            const token: ContractToken = action.payload
            const list = tokens.filter(item => (item.symbol + item.network) != (token.symbol + token.network))
            state.tokens = [ ...list ]
        },
        selectNetworkType: (state, action: PayloadAction<Network>) => {
            state.selectedNetwork = { ...action.payload }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTokens.fulfilled, (state, action: PayloadAction<ContractToken[]>) => {
            const seletedTokenAddress = state.tokens.filter((item: ContractToken) => item.isSelect).map((item: ContractToken) => item.address + item.network)
            const tokens: ContractToken[] = [ ...action.payload ]
            console.log('tokens get:')
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].address === '0x0' || seletedTokenAddress.includes(tokens[i].address + tokens[i].network)) {
                    tokens[i].isSelect = true
                }
            }
            state.tokens = tokens
        })
        builder.addCase(getNetworks.fulfilled, (state, action: PayloadAction<Network[]>) => {
            const networks: Network[] = action.payload
            console.log('networks get:')
            state.networks = networks
            const selectedNetwork: Network = state.selectedNetwork
            if (!selectedNetwork || !selectedNetwork.shortName) {
                state.selectedNetwork = networks[0]
            } else {
                const networkNames = networks.map((network: Network) => network.shortName)
                if (!networkNames.includes(selectedNetwork.shortName)) {
                    state.selectedNetwork = networks[0]
                }
            }
        })
        builder.addCase(getBalance.fulfilled, (state, action: PayloadAction<ContractToken[]>) => {
            state.tokens = [ ...action.payload ]
        })
        builder.addCase(createWallet.fulfilled, (state, action: PayloadAction<CreateWalletPayload>) => {
            const networks: Network[] = state.networks
            if (action.payload.selected) {
                const wallet = action.payload.wallets[1]  // 默认选择 Ethereum 钱包
                state.selectedWallet = wallet
                for (let i = 0; i < networks.length; i++) {
                    const network = networks[i]
                    if (wallet.chain?.toLowerCase() === network.shortName.toLowerCase()) {
                        state.selectedNetwork = network
                    }
                }
            }
            state.wallets = [ ...state.wallets, ...action.payload.wallets ]
        })
    },
})

export const { 
    importWalletByPrivateKey,
    addChildWallet, 
    changeWallet,
    setWalletAlias,
    delWallet,
    clearWallet,
    selectToken,
    addToken,
    delToken,
    selectNetworkType
} = walletSlice.actions
export default walletSlice.reducer