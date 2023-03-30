import { ParamListBase, useNavigation } from "@react-navigation/core"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ethers } from "ethers"
import React from "react"
import { Pressable, Text, View } from "react-native"
import { useDispatch } from "react-redux"
import tw from "twrnc"
import { displayName as appName } from '../../app.json'
import { getNetworks, getTokens } from "../../store/reducers/walletSlice"
import { generateMnemonic, getSeedByMnemonic, getSeedFromMnemonic } from "../../utils/wallet"

function Entry() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const dispatch = useDispatch()
    return (
        <View style={tw`h-full bg-white flex justify-around`}>
            <View style={tw`flex items-center`}>
                <Text style={tw`text-xl text-purple-600 mb-20 font-bold`}>{appName}</Text>
                <Text style={tw`text-2xl mb-6`}>钱包设置</Text>
                <Text style={tw`text-sm text-gray-500`}>导入现有钱包或创建新钱包</Text>
            </View>
            <View style={tw`flex items-center`}>
                <Pressable 
                    onPress={() => {
                        dispatch(getNetworks() as any)
		                dispatch(getTokens() as any)
                        navigation.push('importWallet', { type: 'mnemonic' })
                    }}
                    style={tw`w-56 py-3 border border-purple-600 rounded-full mb-6`}>
                    <Text style={tw`text-purple-600 text-lg text-center`}>使用助记词导入</Text>
                </Pressable>
                <Pressable 
                    onPress={() => {
                        dispatch(getNetworks() as any)
		                dispatch(getTokens() as any)
                        navigation.push('importWallet', { type: 'privateKey' })
                    }}
                    style={tw`w-56 py-3 border border-purple-600 rounded-full mb-6`}>
                    <Text style={tw`text-purple-600 text-lg text-center`}>使用私钥导入</Text>
                </Pressable>
                <Pressable 
                    onPress={async () => {
                        // const start = Date.now()
                        // const mnemonic = await generateMnemonic()
                        // const end = Date.now()
                        // console.log("mnemonic time: ", (end - start) + ' ms')
                        // const start2 = Date.now()
                        // const seedHex = await getSeedFromMnemonic(mnemonic)
                        // const end2 = Date.now()
                        // console.log('seed: ', seedHex)
                        // console.log("seed1 time: ", (end2 - start2) + ' ms')
                        // const start3 = Date.now()
                        // const seedStr = ethers.utils.mnemonicToSeed(mnemonic)
                        // console.log('seed: ', seedStr)
                        // const end3 = Date.now()
                        // console.log("seed2 time: ", (end3 - start3) + ' ms')
                        dispatch(getNetworks() as any)
		                dispatch(getTokens() as any)
                        navigation.push('addWallet')
                    }}
                    style={tw`w-56 py-3 bg-purple-600 rounded-full mb-16`}>
                    <Text style={tw`text-white text-lg text-center`}>创建新钱包</Text>
                </Pressable>
                <Text style={tw`text-gray-500 text-xs text-center`}>继续表示您同意这些条款和条件</Text>
            </View>
        </View>
    )
}

export default Entry