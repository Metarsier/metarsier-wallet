import React, { useEffect } from 'react'
import { ActivityIndicator, View } from "react-native"
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import tw from "twrnc"
import HeaderBar from '../../components/HeaderBar'
import { useIsFocused } from '@react-navigation/native'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'

function Scan() {
    const devices = useCameraDevices()
    const isFocused = useIsFocused()
    const device = devices.back
    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
        checkInverted: true,
    })

    useEffect(() => {
        console.log('barcodes: ', barcodes)
    }, [barcodes])
      
    return (
        <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
            <HeaderBar title={'扫码'} color='#ffffff' backgroundColor="#ffffff00" />
            {
                device && isFocused ? 
                    <Camera
                        style={tw`w-full h-full`}
                        device={device}
                        isActive={isFocused}
                        frameProcessor={frameProcessor}
                        frameProcessorFps={3}
                    /> 
                    : <ActivityIndicator style={tw`w-full h-full`} />
            }
        </View>
    )
}

export default Scan