import { Dispatch, AnyAction } from "redux"
import { SET_RATE } from "../constants"


export const getRate = (symbol: string) => {
    return (dispatch: Dispatch<AnyAction>) => {
        
        fetch(`https://test.bitpay.com/rates/${symbol}`)
            .then((res: Response) => res.json())
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    const rate = res.data.find((item: any) => item.code === 'USD').rate
                    dispatch({
                        type: SET_RATE,
                        payload: { symbol, rate }
                    })
                }
            })
    }
}