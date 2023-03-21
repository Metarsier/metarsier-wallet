import { combineReducers } from 'redux'
import rateReducer from './rateSlice'
import userReducer from './userSlice'
import walletReducer from './walletSlice'

const reducers = combineReducers({
    user: userReducer,
    rate: rateReducer,
    wallet: walletReducer
})

export default reducers