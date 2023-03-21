import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface RateState {
    ETH: number,
    USDT: number,
    USDC: number,
    BNB: number,
    BUSD: number,
    LINK: number,
    DAI: number,
    WBTC: number,
    YFI: number,
    UNI: number,
    TRX: number
}

const initialState: RateState = {
    ETH: 4500,
    USDT: 1,
    USDC: 1,
    BNB: 600,
    BUSD: 1,
    LINK: 1,
    DAI: 1,
    WBTC: 1,
    YFI: 1,
    UNI: 1,
    TRX: 0.5
}

const rateSlice = createSlice({
    name: "rate",
    initialState,
    reducers: {
        setRate: (state, action: PayloadAction<{symbol: string, rate: number}>) => {
            state = { ...state, [action.payload.symbol]: action.payload }
        }
    }
})

export const { setRate } = rateSlice.actions
export default rateSlice.reducer