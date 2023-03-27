import React, { useEffect, useMemo } from "react"
import { FlatList, Image, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, useColorScheme, View } from "react-native"
import { useDispatch, useSelector } from 'react-redux'
import { ParamListBase, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Icon } from 'react-native-eva-icons'
import tw from "twrnc"
import { RootState } from "../../store"
import { selectToken } from "../../store/reducers/walletSlice"
function AddToken() {
    const isDarkMode = useColorScheme() === 'dark'
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const dispatch = useDispatch()
    const selectedNetwork: Network = useSelector((state: RootState) => state.wallet.selectedNetwork)
    const tokens: ContractToken[] = useSelector((state: RootState) => state.wallet.tokens)
    const currentTokens: ContractToken[] = useMemo(() => {
        return tokens.filter((item: ContractToken) => item.network === selectedNetwork.shortName && item.address !== '0x0')
    }, [tokens, selectedNetwork])

    return (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
            <StatusBar
                barStyle={Platform.select({ ios: 'light-content', default: isDarkMode ? 'light-content' : 'dark-content' })}
            />
            <View style={tw`h-14 flex flex-row bg-white`}>
                <View style={tw`w-14 flex justify-center items-center`}></View>
                <View style={tw`flex-1 flex justify-center items-center`}>
                    <Text style={tw`text-base`}>代币</Text>
                </View>
                <Pressable 
                    onPress={() => {
                        navigation.goBack()
                    }}
                    style={tw`w-14 flex justify-center items-center`}>
                    <Icon 
                        name="close" 
                        width={26} 
                        height={26} 
                        fill={tw.color('purple-600')} 
                    />
                </Pressable>
            </View>
            <View style={tw`h-16 py-2 px-4 bg-white`}>
                <TextInput 
                    keyboardType={'web-search'}
                    style={tw`h-10 px-4 rounded-full bg-gray-200`}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    autoComplete={'off'}
                    onChangeText={(text) => {

                    }}
                />
            </View>
            <View 
                style={{
                    ...tw`absolute left-0 right-0 bottom-0`,
                    top: 120
                }}>
                <ScrollView>
                    {
                        currentTokens.length ? 
                        <View style={tw`p-3`}>
                            {
                                currentTokens.map((item: ContractToken) => (
                                    <View 
                                        key={item.address} 
                                        style={{
                                            ...tw`flex flex-row items-center bg-white rounded-lg mb-3 py-2`,
                                            shadowColor: '#000000',
                                            shadowRadius: 2,
                                            shadowOffset: {
                                                width: 0,
                                                height: 3
                                            },
                                            shadowOpacity: 0.03
                                        }}>
                                        <View style={tw`w-14 flex items-center`}>
                                            <Image 
                                                style={tw`w-8 h-8 bg-gray-200 rounded-full`} 
                                                source={{ uri: item.logo }} 
                                            />
                                        </View>
                                        <View style={tw`flex-1`}>
                                            <Text style={tw`text-base`}>{item.name}</Text>
                                            <Text style={tw`text-gray-400`}>{item.symbol}</Text>
                                        </View>
                                        <Pressable 
                                            onPress={() => {
                                                if (item.isSelect) return
                                                dispatch(selectToken(item))
                                                // setTimeout(() => {
                                                //     dispatch(getBalance())
                                                // }, 50)
                                            }}
                                            style={tw`w-12 h-8 flex justify-center items-center`}>
                                                {
                                                    item.isSelect ?
                                                    <Icon 
                                                        name="checkmark-circle-2" 
                                                        width={20}
                                                        height={20}
                                                        fill={tw.color(`gray-400`)}
                                                    /> :
                                                    <Icon 
                                                        name="plus-circle-outline" 
                                                        width={20}
                                                        height={20}
                                                        fill={tw.color('purple-600')} 
                                                    />
                                                }
                                        </Pressable>
                                    </View>
                                ))
                            }
                        </View> : <></>
                    }
                </ScrollView>
            </View>
            
            {/* <FlatList 
                style={tw`p-4`)}
                data={tokenList} 
                keyExtractor={(item) => item.symbol} 
                renderItem={({item, index}) => (
                    <Pressable 
                        key={item.address} 
                        onPress={() => {
                            if (tokenSymbols.includes(item.symbol)) return
                            // dispatch(addToken(item))
                            navigation.goBack()
                        }}
                        style={tw`flex flex-row items-center bg-white p-4 rounded-md ${index === 0 ? '' : 'mt-3'}`)}>
                        <Image
                            style={tw`w-8 h-8 rounded-full bg-gray-200`)}
                            source={item.logo}
                        />
                        <Text style={tw`flex-1 text-base pl-3`)}>
                            {item.symbol}
                        </Text>
                        <View style={tw`w-8 flex items-center justify-center`)}>
                            {
                                tokenSymbols.includes(item.symbol) ?
                                <Icon 
                                    name="checkmark-circle-outline" 
                                    size={26} 
                                    color={getColor('gray-400')} 
                                /> :
                                <Icon 
                                    name="add-circle-outline" 
                                    size={26} 
                                    color={getColor('purple-600')} 
                                />
                            }
                        </View>
                    </Pressable>
                )}
            /> */}
        </View>
    )
}

export default AddToken