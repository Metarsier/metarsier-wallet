import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import Metabit from "../../api/Metabit"
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

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        createWallet: (state, action: PayloadAction<CreateWalletPayload>) => {
            const networks: Network[] = state.networks
            const wallets: HDWallet[] = createWalletByMnemonic(state.wallets, action.payload.mnemonic)
            if (action.payload.selected) {
                const wallet = wallets[1]  // 默认选择 Ethereum 钱包
                state.selectedWallet = wallet
                for (let i = 0; i < networks.length; i++) {
                    const network = networks[i]
                    if (wallet.chain?.toLowerCase() === network.shortName.toLowerCase()) {
                        state.selectedNetwork = network
                    }
                }
            }
            state.wallets = [ ...state.wallets, ...wallets ]
        },
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
            const seletedTokenAddress = state.tokens.filter((item: ContractToken) => item.isSelect).map((item: ContractToken) => item.address)
            const tokens: ContractToken[] = action.payload
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].address === '0x0' || seletedTokenAddress.includes(tokens[i].address)) {
                    tokens[i].isSelect = true
                }
            }
            state.tokens = tokens
        })
        builder.addCase(getNetworks.fulfilled, (state, action: PayloadAction<Network[]>) => {
            const networks: Network[] = action.payload
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
    },
})

export const { 
    createWallet,
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