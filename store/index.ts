// import { createStore, applyMiddleware } from 'redux'
import { configureStore } from "@reduxjs/toolkit"
import thunk from 'redux-thunk'
// import { AsyncStorage } from 'react-native'
import { persistReducer, persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import reducers from './reducers'


const persistConfig = {
	key: 'root',
    version: 0,
	storage: AsyncStorage
}

export const store = configureStore({
    reducer: persistReducer(persistConfig, reducers),
    middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch