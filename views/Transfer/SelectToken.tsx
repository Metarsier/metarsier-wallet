import { ParamListBase, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { View, Platform, StatusBar, useColorScheme, Text, Pressable, TextInput, ScrollView, Image } from "react-native"
import tw from "twrnc"
import { Icon } from 'react-native-eva-icons'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { useMemo, useState } from "react"
import Decimal from "decimal.js-light"

function SelectToken() {
    const dispatch = useDispatch()
    const isDarkMode = useColorScheme() === 'dark'
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const rate: any = useSelector((state: RootState) => state.rate)
    const selectedNetwork: Network = useSelector((state: RootState) => state.wallet.selectedNetwork)
    const tokens: ContractToken[] = useSelector((state: RootState) => state.wallet.tokens)
    const [ keywords, setKeywords ] = useState<string>('')
    const currentTokens: ContractToken[] = useMemo(() => {
        return tokens.filter((item: ContractToken) => {
            if (keywords) {
                return item.network === selectedNetwork.shortName && item.isSelect && (item.symbol.toLowerCase().includes(keywords.toLowerCase()) || item.name.toLowerCase().includes(keywords.toLowerCase()))
            }
            return item.network === selectedNetwork.shortName && item.isSelect
        })
    }, [tokens, selectedNetwork, keywords])
    
    
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
                    placeholder={'搜索代币名称'}
                    onChangeText={(text) => {
                        setKeywords(text)
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
                                    <Pressable 
                                        key={item.address} 
                                        onTouchStart={() => {
                                            navigation.goBack()
                                            navigation.push('transfer', item)
                                        }}
                                        style={{
                                            ...tw`flex flex-row items-center bg-white rounded-lg mb-3 py-4`,
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
                                        <View>
                                            <Text style={tw`text-base`}>{item.name}</Text>
                                            <Text style={tw`text-gray-400`}>{item.symbol}</Text>
                                        </View>
                                        <View style={tw`flex-1 pr-3`}>
                                            <Text style={tw`text-right text-black text-lg`}>
                                                {parseFloat(new Decimal(item.balance || '0').toFixed(8))}
                                            </Text>
                                            <Text style={tw`text-right text-gray-400`}>
                                                ${parseFloat(new Decimal(item.balance || '0').times(rate[item.symbol] ?? 1).toFixed(8))}
                                            </Text>
                                        </View>
                                    </Pressable>
                                ))
                            }
                        </View> : <></>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default SelectToken