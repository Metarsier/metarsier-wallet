import { Dispatch, AnyAction } from "redux"
import { MAINNET } from "../../config"
import { DEL_PASSWORD, CLEAR_WALLET, RESET_NETWORK_TYPE } from "../constants"


export const logout = () => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch({ type: CLEAR_WALLET })
        dispatch({ type: DEL_PASSWORD })
        dispatch({ type: RESET_NETWORK_TYPE })
    }
}