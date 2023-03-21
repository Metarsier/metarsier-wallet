import React from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import Icon from 'react-native-vector-icons/Ionicons'
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
                    // tabBarIcon: ({ color }) => (
                    //     <Icon name="wallet" size={20} color={color} />
                    // )
                }}
            />
            <BottomTab.Screen 
                name="browser" 
                component={Browser} 
                options={{
                    headerTitle: '浏览器',
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: tw.color('purple-600'),
                    // tabBarIcon: ({ color }) => (
                    //     <Icon name="logo-chrome" size={20} color={color} />
                    // )
                }}
            />
            <BottomTab.Screen 
                name="mine" 
                component={Mine} 
                options={{
                    headerTitle: '我的',
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: tw.color('purple-600'),
                    // tabBarIcon: ({ color }) => (
                    //     <Icon name="person" size={20} color={color} />
                    // )
                }}
            />
        </BottomTab.Navigator>
    )
}



export default Main