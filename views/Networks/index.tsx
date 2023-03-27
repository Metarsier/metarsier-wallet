import React from "react"
import { Platform, Pressable, StatusBar, Text, useColorScheme, View } from "react-native"
import { useSelector, useDispatch } from 'react-redux'
import { ParamListBase, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Icon } from 'react-native-eva-icons'
import tw from "twrnc"
import { RootState } from "../../store"
import { selectNetworkType } from "../../store/reducers/walletSlice"

function Networks() {
    const isDarkMode = useColorScheme() === 'dark'
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const dispatch = useDispatch()
    const selectedNetwork: Network = useSelector((state: RootState) => state.wallet.selectedNetwork)
    const selectedWallet: HDWallet = useSelector((state: RootState) => state.wallet.selectedWallet)
    const networks: Network[] = useSelector((state: RootState) => {
        return state.wallet.networks.filter((item: Network) => item.chainType === selectedWallet.type)
    })

    return (
        <View>
            <StatusBar
                barStyle={Platform.select({ ios: 'light-content', default: isDarkMode ? 'light-content' : 'dark-content' })}
            />
            <View style={tw`h-14 flex flex-row bg-white`}>
                <View style={tw`w-14`}></View>
                <View style={tw`flex-1 flex justify-center items-center`}>
                    <Text style={tw`text-lg`}>网络切换</Text>
                </View>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    style={tw`w-14 flex justify-center items-center`}>
                    <Icon 
                        name="close" 
                        width={26} 
                        height={26} 
                        fill={tw.color('purple-600')} 
                    />
                </Pressable>
            </View>
            <View style={tw`p-4`}>
                {
                    networks.map((item: Network, i) => (
                        <Pressable 
                            key={item.name} 
                            onPress={() => {
                                dispatch(selectNetworkType(item))
                                navigation.goBack()
                            }}
                            style={tw`flex flex-row bg-white p-4 rounded-md ${i === 0 ? '' : 'mt-3'}`}>
                            <Text style={tw`flex-1 text-base`}>
                                {item.name}
                            </Text>
                            <View style={tw`w-8 h-8 flex justify-center items-center`}>
                                <Icon 
                                    name="checkmark-circle-2" 
                                    width={20}
                                    height={20}
                                    fill={tw.color(`${selectedNetwork.name === item.name ? 'green-600' : 'gray-200'}`)}
                                />
                            </View>
                        </Pressable>
                    ))
                }
            </View>
        </View>
    )
}

export default Networks