import { Dispatch, AnyAction } from "redux"
import { MAINNET } from "../../config"
import { delPassword } from "../reducers/userSlice"
import { CLEAR_WALLET } from "../reducers/walletSlice"


export const logout = () => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch(CLEAR_WALLET())
        dispatch(delPassword())
    }
}