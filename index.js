/**
 * @format
 */
import { AppRegistry } from 'react-native'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { Buffer } from 'buffer'
import App from './App'
import {name as appName} from './app.json'
import { persistor, store } from "./store"
import 'react-native-get-random-values'
import '@ethersproject/shims'
global.Buffer = Buffer

const ProviderContainer = () => (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App/>
        </PersistGate>
    </Provider>
)


AppRegistry.registerComponent(appName, () => ProviderContainer)
