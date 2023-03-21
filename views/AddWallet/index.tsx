import { useRoute } from "@react-navigation/core"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React, { createContext } from "react"
import ConfirmMnemonic from "./ConfirmMnemonic"
import GenerateMnemonic from "./GenerateMnemonic"

const Stack = createNativeStackNavigator()
export const ActionContext = createContext({
    action: ''
})
function AddWallet() {
    const route = useRoute()
    let action: string = ''
    if (route.params) {
        action = (route.params as any).action
    }
    return (
        <ActionContext.Provider 
            value={{ action }}>
            <Stack.Navigator 
                initialRouteName={'generateMnemonic'}>
                <Stack.Screen 
                    name="generateMnemonic" 
                    component={GenerateMnemonic} 
                    options={{
                        headerShown: false
                    }} 
                />
                <Stack.Screen 
                    name="confirmMnemonic" 
                    component={ConfirmMnemonic} 
                    options={{
                        headerShown: false
                    }} 
                />
            </Stack.Navigator>
        </ActionContext.Provider>
    )
}

export default AddWallet