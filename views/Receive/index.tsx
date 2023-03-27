import { Pressable, Text, View } from "react-native"
import { useSelector } from "react-redux"
import tw from "twrnc"
import QRCode from 'react-native-qrcode-svg'
import { Icon } from 'react-native-eva-icons'
import { RootState } from "../../store"
import Clipboard from "@react-native-clipboard/clipboard"
import Toast from "react-native-root-toast"
function Receive() {
    const selectedWallet = useSelector((state: RootState) => state.wallet.selectedWallet)
    return (
        <View style={tw`p-4`}>
            <View style={tw`flex items-center p-4 bg-purple-600 shadow-lg rounded-lg`}>
                <Text style={tw`text-sm text-white opacity-70`}>扫描二维码向我付款</Text>
                <View style={tw`w-48 h-48 my-4 shadow rounded bg-white flex justify-center items-center`}>
                    <QRCode size={170} value={selectedWallet.address} />
                </View>
                <Text style={tw`text-lg font-bold text-white my-3`}>
                    {selectedWallet.alias || selectedWallet.name}
                </Text>
                <Pressable 
                    onPress={() => {
                        Clipboard.setString(selectedWallet.address)
                        Toast.show('复制成功', {
                            position: Toast.positions.CENTER,
                            shadow: false
                        })
                    }}
                    style={tw`flex flex-row justify-center items-center opacity-80`}>
                    <Text style={tw`text-white text-sm`}>{selectedWallet.address}</Text>
                    <Icon 
                        style={tw`ml-2`}
                        name="copy-outline" 
                        width={18} 
                        height={18} 
                        fill={tw.color('white')} 
                    />
                </Pressable>
                <View style={tw`flex flex-row h-16 mt-4 bg-purple-700 rounded shadow`}>
                    <View style={tw`flex-1 flex flex-row justify-center items-center`}>
                        <Icon 
                            style={tw`mr-2`}
                            name="external-link-outline" 
                            width={18} 
                            height={18} 
                            fill={tw.color('white')} 
                        />
                        <Text style={tw`text-white`}>分享</Text>
                    </View>
                    <View style={{...tw`bg-purple-600`, width: 1}}></View>
                    <View style={tw`flex-1 flex flex-row justify-center items-center`}>
                        <Icon 
                            style={tw`mr-2`}
                            name="save-outline" 
                            width={18} 
                            height={18} 
                            fill={tw.color('white')} 
                        />
                        <Text style={tw`text-white`}>保存二维码</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Receive