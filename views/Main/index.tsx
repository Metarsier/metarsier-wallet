import React from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-eva-icons'
import Home from "./Home"
import Browser from "./Browser"
import Mine from "./Mine"
import tw from "twrnc"

const BottomTab = createBottomTabNavigator()

function Main() {
    return (
        <BottomTab.Navigator initialRouteName="home">
            <BottomTab.Screen 
                name="home" 
                component={Home} 
                options={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarActiveTintColor: tw.color('purple-600'),
                    tabBarIcon: ({ color }) => (
                        <Icon name="npm-outline" width={24} height={24} fill={color} />
                    ),
                    unmountOnBlur: true
                }}
            />
            <BottomTab.Screen 
                name="browser" 
                component={Browser} 
                options={{
                    headerTitle: '浏览器',
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: tw.color('purple-600'),
                    tabBarIcon: ({ color }) => (
                        <Icon name="globe-outline" width={24} height={24} fill={color} />
                    ),
                    unmountOnBlur: true
                }}
            />
            <BottomTab.Screen 
                name="mine" 
                component={Mine} 
                options={{
                    headerTitle: '我的',
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: tw.color('purple-600'),
                    tabBarIcon: ({ color }) => (
                        <Icon name="settings-outline" width={24} height={24} fill={color} />
                    ),
                    unmountOnBlur: true
                }}
            />
        </BottomTab.Navigator>
    )
}



export default Main