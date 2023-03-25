import { ParamListBase, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React from "react"
import { Alert, Pressable, Text, View } from "react-native"
import { Icon } from 'react-native-eva-icons'
import { useDispatch } from 'react-redux'
import tw from "twrnc"
import { delPassword } from "../../store/reducers/userSlice"
import { clearWallet } from "../../store/reducers/walletSlice"

function Mine() {
    const dispatch = useDispatch()
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    return (
        <View>
            <View style={tw`mb-4`}>
                <Pressable 
                    onPress={() => navigation.push('wallets')}>
                    <View style={tw`flex flex-row items-center p-4 bg-white mb-2`}>
                        <View style={tw`w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center`}>
                            <Icon 
                                name="folder" 
                                width={20} 
                                height={20} 
                                fill={tw.color('gray-600')} 
                            />
                        </View>
                        <View style={tw`flex-1 pl-4`}>
                            <Text style={tw`text-black text-lg`}>钱包管理</Text>
                        </View>
                        <View style={tw`w-8 h-8 flex justify-center items-center`}>
                            <Icon 
                                name="chevron-right-outline" 
                                width={30} 
                                height={30} 
                                fill={tw.color('purple-600')} 
                            />
                        </View>
                    </View>
                </Pressable>
            </View>
            <View style={tw`px-4`}>
                <Pressable 
                    onPress={() => {
                        Alert.alert('确定退出？', '退出将不保留钱包的任何数据', [
                            {
                                text: "取消",
                            },
                            {
                                text: "确定",
                                onPress: () => {
                                    dispatch(clearWallet())
                                    dispatch(delPassword())
                                    navigation.navigate('entry')
                                }
                            }
                        ])
                    }}
                    style={tw`py-3 bg-purple-600 rounded-full mb-16`}>
                    <Text style={tw`text-white text-lg text-center`}>退出登录</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Mine