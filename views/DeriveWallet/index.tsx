import { useNavigation, ParamListBase } from "@react-navigation/core"
import React, { useState } from "react"
import { Alert, Pressable, Text, View } from "react-native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import tw from "twrnc"
// import Icon from "react-native-vector-icons/Ionicons"
import { CHAINS } from "../../config"
import { useDispatch } from "react-redux"
import { addChildWallet } from "../../store/actions/walletAction"
import { useRoute } from "@react-navigation/native"

function DeriveWallet() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const dispatch = useDispatch()
    const route = useRoute()
    const { parent } = route.params as { parent: HDWallet }
    const [ chain, setChain ] = useState<string>('Ethereum')
    
    return (
        <>
            <View style={tw`flex flex-row bg-white h-14`}>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    style={tw`w-12 flex justify-center items-center`}>
                    {/* <Icon name="chevron-back" size={24} color={getColor('purple-600')} /> */}
                </Pressable>
                <View style={tw`flex-1 flex justify-center`}>
                    <Text style={tw`text-base text-center text-black`}>
                        派生币种钱包
                    </Text>
                </View>
                <View style={tw`w-12`} />
            </View>
            <View style={tw`h-full bg-white p-4`}>
                <Text style={tw`py-2 text-gray-500`}>请选择区块链网络</Text>
                    <View style={tw`flex flex-row flex-wrap`}>
                        {
                            CHAINS.map((item: string, i: number) => (
                                <Pressable 
                                    key={item}
                                    onPress={() => setChain(item)}
                                    style={{ 
                                        ...tw`${chain === item ? 'bg-green-500' : 'bg-gray-100'} flex items-center py-1 rounded-md`,
                                        width: '30%',
                                        marginLeft: (i-1) % 3 ? 0 : '5%',
                                        marginRight: (i-1) % 3 ? 0 : '5%'
                                    }}>
                                    <Text style={tw`${chain === item ? 'text-white' : 'text-gray-400'} text-base`}>{item}</Text>
                                </Pressable>
                            ))
                        }
                    </View>
                
                <Pressable 
                    onPress={() => {
                        try {
                            // dispatch(addChildWallet(parent, chain))
                            navigation.goBack()
                        } catch (error: any) {
                            Alert.alert(JSON.stringify(error))
                        }
                    }}
                    style={tw`mt-8 py-3 rounded-full mb-16 bg-purple-600`}>
                    <Text style={tw`text-white text-lg text-center`}>确定</Text>
                </Pressable>
            </View>
        </>
    )
}

export default DeriveWallet