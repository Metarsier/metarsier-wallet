import React from "react"
import { ParamListBase, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import {  Pressable, ScrollView, Text, View } from "react-native"
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import { useSelector } from "react-redux"
import tw from "twrnc"
import { RootState } from "../../store"
import WalletItem from "./WalletItem"
import HeaderBar from "../../components/HeaderBar"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

function Wallets() {
    const frame = useSafeAreaFrame()
    const insets = useSafeAreaInsets()
    const defaultHeight = getDefaultHeaderHeight(frame, false, insets.top)
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const hdWallets = useSelector((state: RootState) => state.wallet.wallets.filter((item: HDWallet) => item.type === -1))
    const wallets = useSelector((state: RootState) => state.wallet.wallets.filter((item: HDWallet) => item.type !== -1 && !item.parentId))
    
    return (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
            <HeaderBar 
                title={'钱包管理'} 
                backgroundColor={tw.color('purple-600')} 
                color={'#ffffff'} 
            />
            <View style={tw`bg-purple-600 absolute z-0 top-0 left-0 right-0 h-1/3`}></View>
            <View 
                style={{
                    ...tw`relative h-full z-10`, 
                    paddingTop: defaultHeight
                }}>
                <ScrollView>
                    <View style={tw`flex items-center py-6 bg-purple-600`}>
                        <Pressable 
                            onPress={() => {
                                navigation.push('importWallet', {
                                    type: 'mnemonic',
                                    action: 'back'
                                })
                            }}
                            style={tw`w-56 py-2 bg-white rounded-full mb-3`}>
                            <Text style={tw`text-purple-600 text-sm text-center`}>使用助记词导入HD钱包</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => {
                                navigation.push('importWallet', {
                                    type: 'privateKey',
                                    action: 'back'
                                })
                            }}
                            style={tw`w-56 py-2 bg-white rounded-full mb-3`}>
                            <Text style={tw`text-purple-600 text-sm text-center`}>使用私钥导入币种钱包</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => {
                                navigation.push('addWallet', {
                                    action: 'back'
                                })
                            }}
                            style={tw`w-56 py-2 bg-white rounded-full`}>
                            <Text style={tw`text-purple-600 text-sm text-center`}>创建新钱包</Text>
                        </Pressable>
                    </View>
                    <View style={tw`bg-gray-100`}>
                        {
                            hdWallets && hdWallets.length ? 
                            <View style={tw`px-3 py-2`}>
                                <Text style={tw`py-2 text-gray-500`}>HD钱包列表</Text>
                                {
                                    hdWallets.map((wallet: HDWallet) => (
                                        <WalletItem key={wallet.id} wallet={wallet} />
                                    ))
                                }
                            </View> : <></>
                        }
                        {
                            wallets && wallets.length ? 
                            <View style={tw`px-3 py-2`}>
                                <Text style={tw`py-2 text-gray-500`}>币种钱包列表</Text>
                                {
                                    wallets.sort((a: HDWallet, b: HDWallet) => {
                                        if (a.chain && b.chain) return a.chain.charCodeAt(0) - b.chain.charCodeAt(0)
                                        return 1
                                    }).map((wallet: HDWallet) => (
                                        <WalletItem key={wallet.id} wallet={wallet} />
                                    ))
                                }
                            </View> : <></>
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Wallets