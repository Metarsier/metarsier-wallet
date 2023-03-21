import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        createWallet: (state, action: PayloadAction<HDWallet[]>) => {
            state.wallets = [ ...state.wallets, ...action.payload ]
        },
        addChildWallet: (state, action: PayloadAction<HDWallet[]>) => {
            state.wallets = [ ...state.wallets, ...action.payload ]
        },
        changeWallet: (state, action: PayloadAction<HDWallet>) => {
            state.selectedWallet  = action.payload
        },
        setWallet: (state, action: PayloadAction<HDWallet>) => {
            const wallet: HDWallet = action.payload
            for (let i = 0; i < state.wallets.length; i++) {
                if (wallet.publicKey === state.wallets[i].publicKey) {
                    state.wallets[i].alias = wallet.alias
                }
            }
            state.wallets = [ ...state.wallets ]
        },
        delWallet: (state, action: PayloadAction<HDWallet>) => {
            // state.wallets = { ...action.payload }
        },
        clearWallet: (state) => {
            state = { ...initialState }
        },
        setTokens: (state, action: PayloadAction<ContractToken[]>) => {
            state.tokens = [ ...action.payload ]
        },
        setNetworks: (state, action: PayloadAction<Network[]>) => {
            state.networks = [ ...action.payload ]
        },
        setSelectedNetwork: (state, action: PayloadAction<Network>) => {
            state.selectedNetwork = { ...action.payload }
        },
        resetNetworkType: (state) => {
            state = { ...initialState }
        }
    },
})

export const { 
    createWallet, 
    addChildWallet, 
    changeWallet,
    setWallet,
    delWallet,
    clearWallet,
    setTokens,
    setNetworks,
    setSelectedNetwork,
    resetNetworkType
} = walletSlice.actions
export default walletSlice.reducer

// const reducer = (state: WalletState = initState, action: AnyAction) => {
//     switch (action.type) {
//         case CREATE_WALLET:
//             return { 
//                 ...state, 
//                 wallets: [ ...state.wallets, ...action.payload ]
//             }
//         case ADD_CHILD_WALLET:
//             return { ...state, wallets: [ ...state.wallets, ...action.payload ] }
//         case CHANGE_WALLET:
//             /**
//              * 每次切换只能展示一种币种的钱包，因为需要切换主网与各种测试网络
//              */
//             return { ...state, selectedWallet: action.payload }
//         case SET_WALLET:
//             const wallet: HDWallet = action.payload
//             for (let i = 0; i < state.wallets.length; i++) {
//                 if (wallet.publicKey === state.wallets[i].publicKey) {
//                     state.wallets[i].alias = wallet.alias
//                 }
//             }
//             return { ...state, wallets: [...state.wallets] }
//         case DEL_WALLET:
//             return { ...state, wallets: { ...action.payload } }
//         case CLEAR_WALLET:
//             return { ...initState }
//         case SET_TOKEN:
//             return { ...state, tokens: [...action.payload] }
//         case SET_NETWORK:
//             return { ...state, networks: [...action.payload] }
//         case SET_SELECTED_NETWORK:
//             return { ...state, selectedNetwork: action.payload }
//         case RESET_NETWORK_TYPE:
//             return { ...initState }
//         default:
//             return state
//     }
// }

// export default reducer