import { Pressable, Text, View } from "react-native"
import tw from "twrnc"
import { Icon } from 'react-native-eva-icons'
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import HeaderBar from "../../components/HeaderBar"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"
import { ParamListBase, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

function TransferSuccess() {
    const frame = useSafeAreaFrame()
    const insets = useSafeAreaInsets()
    const defaultHeight = getDefaultHeaderHeight(frame, false, insets.top)
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

    return (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
            <HeaderBar title={'转账成功'} />
            <View 
                style={{
                    ...tw`relative h-full z-10`, 
                    paddingTop: defaultHeight
                }}>
                <View style={tw`flex flex-col items-center rounded-lg shadow bg-white m-4 p-4`}>
                    <Icon 
                        name="checkmark-circle-2" 
                        width={44} 
                        height={44} 
                        fill={tw.color('green-600')} 
                    />
                    <Text style={tw`mt-3 text-green-600`}>转账成功</Text>
                </View>
                <Pressable 
                    onTouchStart={() => {
                        navigation.replace('main')
                    }}
                    style={tw`m-4 py-3 rounded-full bg-purple-600`}>
                    <Text style={tw`text-white text-lg text-center`}>返回首页</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default TransferSuccess