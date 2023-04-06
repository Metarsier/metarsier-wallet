import { Image, Pressable, ScrollView, Text, View } from "react-native"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import tw from "twrnc"
import HeaderBar from "../../components/HeaderBar"
import { ParamListBase, useNavigation, useRoute } from "@react-navigation/native"
import Decimal from "decimal.js-light"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useEffect } from "react"

function Record() {
    const frame = useSafeAreaFrame()
    const insets = useSafeAreaInsets()
    const defaultHeight = getDefaultHeaderHeight(frame, false, insets.top)
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    const route = useRoute()
    const token = route.params as ContractToken
    const rate: any = useSelector((state: RootState) => state.rate)

    useEffect(() => {

    }, [token])
    
    return (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
            <HeaderBar 
                title={
                    <View>
                        <Text style={tw`text-center`}>{token.symbol} 历史记录</Text>
                        <Text style={tw`text-center text-xs text-gray-400`}>{token.network}</Text>
                    </View>
                } 
            />
            <View 
                style={{
                    ...tw`relative h-full z-10`, 
                    paddingTop: defaultHeight
                }}>
                <ScrollView>
                    <View style={tw`p-4`}>
                        <View style={tw`flex items-center`}>
                            <Image 
                                style={tw`w-12 h-12 bg-gray-200 rounded-full`} 
                                source={{ uri: token.logo }} 
                            />
                            <Text style={tw`text-lg mt-4`}>
                                {parseFloat(new Decimal(token.balance || '0').toFixed(8))} {token.symbol}
                            </Text>
                            <Text style={tw`text-xs text-gray-600`}>
                                {parseFloat(new Decimal(token.balance || '0').times(rate[token.symbol] ?? 1).toFixed(8))}
                            </Text>
                        </View>
                        <View style={tw`flex flex-row bg-white rounded py-2 mt-4`}>
                            <Pressable 
                                onPress={() => {
                                    navigation.push('transfer', token)
                                }}
                                style={tw`flex-1 py-3`}>
                                <Text style={tw`text-center`}>转账</Text>
                            </Pressable>
                            <View style={{ ...tw`h-full bg-gray-100`, width: 1 }}></View>
                            <Pressable 
                                onPress={() => {
                                    navigation.push('receive')
                                }}
                                style={tw`flex-1 py-3`}>
                                <Text style={tw`text-center`}>收款</Text>
                            </Pressable>
                        </View>
                    </View>

                </ScrollView>
            </View>
        </View>
    )
}

export default Record