import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar, useColorScheme } from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import AddToken from "./AddToken";
import AddWallet from "./AddWallet";
import DeriveWallet from "./DeriveWallet";
import Entry from "./Entry";
import ImportWallet from "./ImportWallet";
import Main from "./Main";
import Networks from "./Networks";
import Receive from "./Receive";
import Scan from "./Scan";
import Transfer from "./Transfer";
import SelectToken from "./Transfer/SelectToken";
import TransferSuccess from "./Transfer/TransferSuccess";
import Wallets from "./Wallets";
import HDWalletInfo from "./Wallets/HDWalletInfo";
import SelectWallet from "./Wallets/SelectWallet";
import WalletInfo from "./Wallets/WalletInfo";

const Stack = createNativeStackNavigator()

function Navigator() {
    const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	}
	const wallets = useSelector((state: RootState) => state.wallet.wallets)
    
    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
				<Stack.Navigator initialRouteName={wallets && wallets.length ? 'main' : 'entry'}>
					<Stack.Screen 
						name="entry" 
						component={Entry} 
						options={{ headerShown: false }} 
					/>
					<Stack.Screen 
						name="main" 
						component={Main} 
						options={{ headerShown: false }} 
					/>
					<Stack.Screen 
						name="scan" 
						component={Scan} 
					/>
					<Stack.Screen 
						name="receive" 
						component={Receive} 
						options={{ 
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="wallets" 
						component={Wallets}
						options={{ 
							headerShown: false
						}}
					/>
					<Stack.Screen 
						name="hdWalletInfo" 
						component={HDWalletInfo}
						options={{ 
							headerShown: false
						}}
					/>
					<Stack.Screen 
						name="walletInfo" 
						component={WalletInfo}
						options={{ 
							headerShown: false
						}}
					/>
					<Stack.Screen 
						name="addWallet" 
						component={AddWallet} 
						options={{ 
							presentation: 'modal',
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="importWallet" 
						component={ImportWallet} 
						options={{ 
							presentation: 'modal',
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="deriveWallet" 
						component={DeriveWallet} 
						options={{ 
							presentation: 'modal',
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="selectWallet" 
						component={SelectWallet} 
						options={{ 
							presentation: 'modal',
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="networks" 
						component={Networks} 
						options={{ 
							presentation: 'modal',
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="addToken" 
						component={AddToken} 
						options={{ 
							presentation: 'modal',
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="selectToken" 
						component={SelectToken} 
						options={{ 
							presentation: 'modal',
							headerShown: false
						}} 
					/>
					<Stack.Screen 
						name="transfer" 
						component={Transfer}
						options={{ 
							headerShown: false
						}}
					/>
					<Stack.Screen 
						name="transferSuccess" 
						component={TransferSuccess}
						options={{ 
							headerShown: false
						}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
        </>
    )
}

export default Navigator