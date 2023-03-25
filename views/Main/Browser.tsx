import React, { useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { WebView } from 'react-native-webview'
import tw from "twrnc"

function Brower() {
    const [ loading, setLoading ] = useState<boolean>(true)
    
    return (
        <View style={tw`relative w-full h-full`}>
            {
                loading ?
                <View style={tw`absolute top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center`}>
                    <ActivityIndicator />
                </View> : <></>
            }
            <WebView 
                onLoadEnd={() => {
                    setLoading(false)
                }} 
                source={{ uri: `https://www.bing.com/` }} 
            />
        </View>
    )
}

export default Brower