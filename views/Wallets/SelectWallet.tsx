import React, { useEffect, useState } from "react"
import { Image, Platform, Pressable, ScrollView, StatusBar, Text, useColorScheme, View } from "react-native"
import tw from "twrnc"
// import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation, ParamListBase } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { CHAIN_MAP } from "../../config"
import { changeWallet } from "../../store/actions/walletAction"

function SelectWallet() {
    const isDarkMode = useColorScheme() === 'dark'
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const selectedWallet: HDWallet = useSelector((state: RootState) => state.wallet.selectedWallet)
    const wallets: HDWallet[] = useSelector((state: RootState) => state.wallet.wallets)
    const w: HDWallet[] = wallets.filter((item: HDWallet) => !item.parentId)
    const [ list, setList ] = useState<HDWallet[]>(JSON.parse(JSON.stringify(w)))

    useEffect(() => {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < wallets.length; j++) {
                if (list[i].id === wallets[j].parentId) {
                    list[i].children?.push(wallets[j])
                }
            }
        }
        setList([...list])
    }, [])

    return (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
            <StatusBar
                barStyle={Platform.select({ ios: 'light-content', default: isDarkMode ? 'light-content' : 'dark-content' })}
            />
            <View style={tw`h-14 flex flex-row bg-white`}>
                <View style={tw`w-14`}></View>
                <View style={tw`flex-1 flex justify-center items-center`}>
                    <Text style={tw`text-lg`}>切换钱包</Text>
                </View>
                <Pressable 
                    onPress={() => navigation.goBack()}
                    style={tw`w-14 flex justify-center items-center`}>
                    {/* <Icon name="close" size={26} color={getColor('purple-600')} /> */}
                </Pressable>
            </View>
            <View style={tw`absolute top-14 left-0 right-0 bottom-0`}>
                <ScrollView style={tw`p-3`}>
                    {
                        list.sort((a: HDWallet, b: HDWallet) => {
                            if (a.chain && b.chain) return a.chain.charCodeAt(0) - b.chain.charCodeAt(0)
                            return 1
                        }).map((item: HDWallet) => (
                            <View 
                                key={item.id} 
                                style={{
                                    ...tw`bg-white p-3 rounded-lg mb-3`,
                                    shadowColor: '#000000',
                                    shadowRadius: 2,
                                    shadowOffset: {
                                        width: 0,
                                        height: 3
                                    },
                                    shadowOpacity: 0.03
                                }}>
                                {
                                    item.type === -1 ? 
                                    <Text style={tw`text-gray-600`}>
                                        {item.alias ?? (item.name + ' ' + (item.index + 1))}
                                    </Text> :
                                    <View style={tw`flex flex-row py-1`}>
                                        <View style={tw`w-10`}>
                                            <Image 
                                                style={tw`w-8 h-8 bg-gray-200 rounded-full`} 
                                                source={CHAIN_MAP[item.chain as string]} 
                                            />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`text-base`}>
                                                {item.alias ?? (item.name + ' ' + (item.index + 1))}
                                            </Text>
                                        </View>
                                        <Pressable 
                                            onPress={() => {
                                                // dispatch(changeWallet(item))
                                                navigation.goBack()
                                            }}
                                            style={tw`w-8 h-8 flex justify-center items-center`}>
                                            {/* <Icon 
                                                name="checkmark-circle" 
                                                size={20}
                                                color={getColor(`${selectedWallet.id === item.id ? 'green-600' : 'gray-200'}`)}
                                            /> */}
                                        </Pressable>
                                    </View>
                                }
                                {
                                    item.type === -1 && item.children && item.children.length ? 
                                    <View 
                                        style={{
                                            ...tw`mt-2 pt-2`,
                                            borderTopColor: tw.color('gray-200'),
                                            borderTopWidth: 0.5
                                        }}>
                                        {
                                            item.children.sort((a: HDWallet, b: HDWallet) => {
                                                if (a.chain && b.chain) return a.chain.charCodeAt(0) - b.chain.charCodeAt(0)
                                                return 1
                                            }).map((it: HDWallet) => (
                                                <View key={it.id} style={tw`flex flex-row py-2`}>
                                                    <View style={tw`w-10`}>
                                                        <Image 
                                                            style={tw`w-8 h-8 bg-gray-200 rounded-full`} 
                                                            source={CHAIN_MAP[it.chain as string]} 
                                                        />
                                                    </View>
                                                    <View style={tw`flex-1`}>
                                                        <Text style={tw`text-base`}>
                                                            {it.alias ?? (it.name + ' ' + (it.index + 1))}
                                                        </Text>
                                                    </View>
                                                    <Pressable 
                                                        onPress={() => {
                                                            // dispatch(changeWallet(it))
                                                            navigation.goBack()
                                                        }}
                                                        style={tw`w-8 h-8 flex justify-center items-center`}>
                                                        {/* <Icon 
                                                            name="checkmark-circle" 
                                                            size={20}
                                                            color={getColor(`${selectedWallet.id === it.id ? 'green-600' : 'gray-200'}`)}
                                                        /> */}
                                                    </Pressable>
                                                </View>
                                            ))
                                        }
                                    </View> : <></>
                                }
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default SelectWallet