import { useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import tw from "twrnc"
import Clipboard from "@react-native-clipboard/clipboard"
import Modal from "react-native-modal"
import HeaderBar from "../../components/HeaderBar"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import Toast from "react-native-root-toast"
import { isValidAddress } from "@ethereumjs/util"

function Transfer() {
    const frame = useSafeAreaFrame()
    const insets = useSafeAreaInsets()
    const defaultHeight = getDefaultHeaderHeight(frame, false, insets.top)
    const route = useRoute()
    const token = route.params as ContractToken
    const selectedNetwork: Network = useSelector((state: RootState) => state.wallet.selectedNetwork)
    const selectedWallet: HDWallet = useSelector((state: RootState) => state.wallet.selectedWallet)
    const [ address, setAddress ] = useState<string>('')
    const [ amount, setAmount ] = useState<string>('')
    const [ showPayModal, setShowPayModal ] = useState<boolean>(false)
    return (
        <>
            <View style={tw`absolute top-0 left-0 right-0 bottom-0`}>
                <HeaderBar title={'转账'} />
                <View 
                    style={{
                        ...tw`relative h-full z-10`, 
                        paddingTop: defaultHeight
                    }}>
                    <ScrollView>
                        <View style={tw`h-full p-4`}>
                            <View style={tw`flex flex-row`}>
                                <Text style={tw`flex-1 py-2 text-gray-500`}>收款地址</Text>
                                <Pressable 
                                    onTouchStart={async () => {
                                        const txt = await Clipboard.getString()
                                        setAddress(txt)
                                    }}
                                    style={tw`w-12 flex items-center justify-center`}>
                                    <Text style={tw`flex-1 text-right py-2 text-purple-600`}>粘贴</Text>
                                </Pressable>
                            </View>
                            <TextInput
                                style={{
                                    ...tw`p-3 text-base rounded-md bg-white border-gray-200`,
                                    borderWidth: 0.5,
                                    lineHeight: 20
                                }}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                autoComplete={'off'}
                                onChangeText={setAddress}
                                placeholder={token.symbol + '地址'}
                                value={address}
                            />
                            <Text style={tw`py-2 text-gray-500`}>数量</Text>
                            <TextInput
                                style={{
                                    ...tw`p-3 text-base rounded-md bg-white border-gray-200`,
                                    borderWidth: 0.5,
                                    lineHeight: 20
                                }}
                                keyboardType={'numeric'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                autoComplete={'off'}
                                placeholder={'0'}
                                onChangeText={setAmount}
                                value={amount}
                            />
                            <View style={tw`mt-10`}>
                                <Pressable 
                                    onPress={() => {
                                        if (!address) {
                                            return Toast.show('收款地址不能为空', {
                                                position: Toast.positions.CENTER,
                                                shadow: false
                                            })
                                        }
                                        if (selectedNetwork.chainType === 60) {
                                            if (!isValidAddress(address)) {
                                                return Toast.show('输入地址格式不正确', {
                                                    position: Toast.positions.CENTER,
                                                    shadow: false
                                                })
                                            }
                                        } else {
                                            
                                        }
                                        if (!amount) {
                                            return Toast.show('数量不能为空', {
                                                position: Toast.positions.CENTER,
                                                shadow: false
                                            })
                                        }
                                        setShowPayModal(true)
                                    }}
                                    style={tw`py-3 bg-purple-600 rounded-full mb-16`}>
                                    <Text style={tw`text-white text-lg text-center`}>下一步</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <Modal 
                isVisible={showPayModal}
                style={tw`m-0 justify-end`}
                onBackdropPress={() => setShowPayModal(false)}
                onBackButtonPress={() => setShowPayModal(false)}
                onSwipeComplete={() => setShowPayModal(false)}
                swipeDirection={'down'}
                propagateSwipe>
                <SafeAreaView 
                    style={{
                        ...tw`bg-white flex`,
                        minHeight: 450
                    }}>
                    <View style={tw`h-8 flex justify-center items-center`}>
                        <View 
                            style={{
                                ...tw`w-10 bg-gray-400 opacity-50`,
                                height: 5,
                                borderRadius: 4
                            }} 
                        />
                    </View>
                    <Text style={tw`text-base text-center text-gray-600`}>支付详情</Text>
                    <Text style={tw`text-base text-center text-gray-600`}>{selectedNetwork.shortName}</Text>
                    <View style={tw`p-6`}>
                        <View style={tw`flex flex-row justify-center items-center mb-4`}>
                            <Text style={tw`text-3xl`}>{amount}</Text>
                            <Text style={tw`text-lg ml-1`}>{token.symbol}</Text>
                        </View>
                        <View style={tw`flex flex-row py-3 border-b border-gray-100`}>
                            <Text style={tw`w-24 text-gray-500`}>支付信息</Text>
                            <Text style={tw`flex-1`}>{token.symbol} 转账</Text>
                        </View>
                        <View style={tw`flex flex-row py-3 border-b border-gray-100`}>
                            <Text style={tw`w-24 text-gray-500`}>收款地址</Text>
                            <Text style={tw`flex-1`}>{address}</Text>
                        </View>
                        <View style={tw`flex flex-row py-3`}>
                            <Text style={tw`w-24 text-gray-500`}>付款地址</Text>
                            <Text style={tw`flex-1`}>{selectedWallet.address}</Text>
                        </View>
                        {/* <View style={tw`flex flex-row py-3`}>
                            <Text style={tw`w-24 text-gray-500`}>矿工费</Text>
                            <Text style={tw`flex-1`}></Text>
                        </View> */}
                    </View>
                    <View style={tw`flex flex-row items-center p-4`}>
                        <Pressable 
                            onPress={() => {
                                setShowPayModal(false)
                            }}
                            style={tw`flex-1 py-2 border border-purple-600 rounded-full mr-4`}>
                            <Text style={tw`text-purple-600 text-lg text-center`}>取消</Text>
                        </Pressable>
                        <Pressable 
                            onPress={() => {
                                // dispatch(setWalletAlias({ id: hdWallet.id, alias }))
                                setShowPayModal(false)
                            }}
                            style={tw`flex-1 py-2 border border-purple-600 bg-purple-600 rounded-full`}>
                            <Text style={tw`text-white text-lg text-center`}>确定</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

export default Transfer