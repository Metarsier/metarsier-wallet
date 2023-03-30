import { ParamListBase, useNavigation } from "@react-navigation/core"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Pressable, Text, View } from "react-native"
import { useSelector } from "react-redux"
import tw from "twrnc"
import { RootState } from "../../store"
// import Icon from "react-native-vector-icons/Ionicons"
import { createWalletByMnemonic } from "../../utils"

function GenerateMnemonic() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const wallets = useSelector((state: RootState) => state.wallet.wallets)
    const [ mnemonic, setMnemonic ] = useState<string[]>([])
    const [ loading, setLoading ] = useState<boolean>(true)

    useEffect(() => {
        createWalletByMnemonic(wallets).then((list: HDWallet[]) => {
            const root = list[0]
            if (root && root.mnemonic && root.mnemonic) {
                setMnemonic(root.mnemonic.split(' '))
                setLoading(false)
            }
        })
    }, [])

    return (
        <>
            <View style={tw`flex flex-row bg-white h-14`}>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    style={tw`w-12 flex justify-center items-center`}>
                    {/* <Icon name="chevron-back" size={24} color={getColor('purple-600')} /> */}
                </Pressable>
                <View style={tw`flex-1 flex justify-center`}>
                    <Text style={tw`text-base text-center text-white`}>钱包</Text>
                </View>
                <View style={tw`w-12`} />
            </View>
            <View style={tw`p-4 h-full bg-white`}>
                <Text style={tw`text-lg text-center mb-3`}>写下您的助记词</Text>
                <Text style={{ ...tw`text-sm text-center text-gray-600`, lineHeight: 24 }}>
                    这是您的助记词。将它写在纸上并存放在安全的地方。您将需要在下一步中重新输入此助记词（按顺序）。
                </Text>
                <View 
                    style={{ 
                        ...tw`border-gray-200 rounded-md p-3 my-4 flex flex-row flex-wrap`, 
                        borderWidth: 0.5, 
                    }}>
                    {
                        loading ? 
                        <View style={tw`w-full h-64 flex items-center justify-center`}>
                            <ActivityIndicator />
                        </View> : 
                        mnemonic.map((item: string, i: number) => (
                            <View 
                                key={i}
                                style={{ 
                                    ...tw`flex flex-row px-3 py-2 rounded-full border-purple-500 border-dashed mr-3 ${i < 2 ? '' : 'mt-3'}`, 
                                    borderWidth: 0.5,
                                    width: '45%',
                                    marginRight: (i+1) % 2 ? '10%' : 0
                                }}>
                                <Text 
                                    style={tw`w-12 text-center text-black`}>
                                    {i + 1}.
                                </Text>
                                <Text 
                                    style={tw`flex-1 text-black`}>
                                    {item}
                                </Text>
                            </View>
                        ))
                    }
                </View>
                
                <Pressable 
                    disabled={loading}
                    onPress={() => {
                        navigation.push('confirmMnemonic', { mnemonic })
                    }}
                    style={tw`py-3 rounded-full ${loading ? 'bg-purple-200' : 'bg-purple-600'}`}>
                    <Text style={tw`text-white text-lg text-center`}>下一步</Text>
                </Pressable>
            </View>
        </>
    )
}

export default GenerateMnemonic
