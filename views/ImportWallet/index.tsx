import { ParamListBase, useNavigation, useRoute } from "@react-navigation/core"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { Icon } from 'react-native-eva-icons'
import Clipboard from '@react-native-clipboard/clipboard'
import tw from "twrnc"
import { useDispatch, useSelector } from 'react-redux'
import { createWallet, importWalletByPrivateKey } from "../../store/actions/walletAction"
import { CHAINS } from "../../config"
import { RootState } from "../../store"

function ImportWallet() {
    const route = useRoute()
    const type = (route.params as any).type as string
    const action = (route.params as any).action as string
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const dispatch = useDispatch()
    const wallets = useSelector((state: RootState) => state.wallet.wallets) as HDWallet[]
    const [ text, setText ] = useState<string>('')
    const [ chain, setChain ] = useState<string>('Ethereum')
    const [ toastVisible, setToastVisible ] = useState<boolean>(false)
    const [ toastText, setToastText ] = useState<string>('')
    return (
        <View style={tw`relative`}>
            <View style={tw`flex flex-row bg-white h-14`}>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    style={tw`w-12 flex justify-center items-center`}>
                    <Icon 
                        name="chevron-left-outline" 
                        width={36} 
                        height={36} 
                        fill={tw.color(`purple-600`)}
                    />
                </Pressable>
                <View style={tw`flex-1 flex justify-center`}>
                    <Text style={tw`text-base text-center text-black`}>
                        { type === 'mnemonic' ? '从助记词导入' : '从私钥导入'}
                    </Text>
                </View>
                <Pressable 
                    onPress={async () => {
                        const txt = await Clipboard.getString()
                        setText(txt)
                    }}
                    style={tw`w-12 flex items-center justify-center`}>
                    <Text style={tw`text-purple-600`}>粘贴</Text>
                </Pressable>
            </View>
            <View style={tw`h-full bg-white p-4`}>
                <TextInput
                    style={{
                        ...tw`h-36 p-3 text-base rounded-md bg-gray-100 border-gray-200`,
                        borderWidth: 0.5,
                        lineHeight: 20
                    }}
                    multiline
                    numberOfLines={10}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    autoComplete={'off'}
                    onChangeText={setText}
                    value={text}
                />
                {
                    type !== 'mnemonic' ? 
                    <>
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
                    </> : 
                    <Text style={tw`text-gray-500 py-2`}>
                        使用助记词导入默认创建以太坊和波场钱包，如需添加其他钱包，导入后进入钱包详情进行派生
                    </Text>
                }
                
                <Pressable 
                    disabled={!text.trim()}
                    onPress={() => {
                        try {
                            const isSelect = !(action && action === 'back')
                            if (type === 'mnemonic') {
                                const mnemonic = text.trim()
                                dispatch(createWallet(mnemonic, isSelect) as any)
                            } else if (type === 'privateKey') {
                                const privateKey = text.trim()
                                // dispatch(importWalletByPrivateKey(privateKey, chain, isSelect))
                            }
                            if (action && action === 'back') {
                                navigation.goBack()
                            } else {
                                navigation.replace('main')
                            }
                        } catch (error: any) {
                            console.log(error)
                            setToastText(JSON.stringify(error))
                            setToastVisible(true)
                            setTimeout(() => {
                                setToastVisible(false)
                            }, 1500)
                        }
                    }}
                    style={tw`mt-8 py-3 rounded-full mb-16 ${!text.trim() ? 'bg-purple-200' : 'bg-purple-600'}`}>
                    <Text style={tw`text-white text-lg text-center`}>导入</Text>
                </Pressable>
            </View>
            {
                toastVisible ? 
                <View style={tw`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center`}>
                    <View style={tw`p-3 bg-black rounded`}>
                        <Text style={tw`text-white`}>{toastText}</Text>
                    </View>
                </View> : <></>
            }
            
        </View>
    )
}

export default ImportWallet