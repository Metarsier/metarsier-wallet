import React from "react"
import { Platform, Pressable, StatusBar, Text, useColorScheme, View } from "react-native"
import tw from "twrnc"
// import Icon from "react-native-vector-icons/Ionicons"
import { ParamListBase, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"
import { getDefaultHeaderHeight } from '@react-navigation/elements'

interface HeaderBarProps {
    title?: string | JSX.Element,
    backgroundColor?: string
    color?: string,
    left?: string | JSX.Element,
    right?: string | JSX.Element
}

function HeaderBar({ title = '', backgroundColor = '#ffffff', color = '#000000', left, right }: HeaderBarProps) {
    const isDarkMode = useColorScheme() === 'dark'
    const frame = useSafeAreaFrame()
    const insets = useSafeAreaInsets()
    const defaultHeight = getDefaultHeaderHeight(frame, false, insets.top)
    
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
    
    return (
        <>
            <StatusBar 
                barStyle={
                    Platform.select({ ios: 'light-content', default: isDarkMode ? 'light-content' : 'dark-content' })
                } 
            />
            <View 
                style={{
                    ...tw`absolute z-20 left-0 right-0 top-0 flex flex-row bg-purple-600`,
                    backgroundColor,
                    height: defaultHeight,
                    paddingTop: insets.top
                }}>
                <View style={tw`w-12`}>
                    {
                        left ? left : 
                        <Pressable 
                            onPress={() => navigation.goBack()}
                            style={tw`w-full h-full flex justify-center items-center`}>
                            {/* <Icon name="chevron-back" size={24} color={color} /> */}
                        </Pressable>
                    }
                </View>
                <View style={tw`flex-1 flex justify-center`}>
                    {
                        typeof title === 'string' ? 
                        <Text 
                            style={{
                                ...tw`text-base text-center`,
                                color
                            }}>
                            {title}
                        </Text> : title
                    }
                </View>
                <View style={tw`w-12`}>
                    {
                        right 
                            ? (
                                typeof right === 'string' 
                                    ? <Text 
                                        style={{
                                            ...tw`text-base`,
                                            color
                                        }}>
                                        {right}
                                        </Text> 
                                    : right
                            ) 
                        : <></>
                    }
                </View>
            </View>
        </>
    )
}

export default HeaderBar