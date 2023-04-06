import { Chain, Common } from '@ethereumjs/common'
import { Transaction, TxData } from '@ethereumjs/tx'
import { intToHex } from '@ethereumjs/util'
import { BigNumber, Contract, ethers } from 'ethers'
import ABI from '../config/ABI'

export async function getGasPrice(provider: ethers.providers.JsonRpcProvider) {
    let gasPrice = await provider.getGasPrice()
    gasPrice = BigNumber.from(12).mul(gasPrice).div(10)
    return gasPrice.toHexString()
}

export function signTx(
    privateKey: Buffer, 
    token: ContractToken,
    to: string, 
    amount: string, 
    gasPrice: string, 
    nonce: number
) {
    console.log('token: ', token)
    const isContract = token.address !== '0x0'
    const common = new Common({ chain: Chain.Goerli })
    const txParams: TxData = { gasPrice, nonce }
    if (isContract) {
        const iface = new ethers.utils.Interface(ABI[token.chainType])
        const data = iface.encodeFunctionData('transfer', [to, ethers.utils.parseUnits(amount, token.decimals).toHexString()])
        txParams.value = '0x00'
        txParams.to = token.address
        txParams.gasLimit = intToHex(100000)
        txParams.data = data
    } else {
        txParams.value = ethers.utils.parseUnits(amount, token.decimals).toHexString()
        txParams.to = to
        txParams.gasLimit = intToHex(21000)
    }
    console.log('txParams: ', txParams)
    const tx = Transaction.fromTxData(txParams, { common })
    const signedTx = tx.sign(privateKey)
    console.log('signedTx: ', signedTx)
    return '0x' + signedTx.serialize().toString('hex')
}

export async function broadTx(provider: ethers.providers.JsonRpcProvider, serializedTx: string) {
    const res: ethers.providers.TransactionResponse = await provider.sendTransaction(serializedTx)
    return res
}

export async function transfer(
    selectedWallet: HDWallet, 
    selectedNetwork: Network, 
    token: ContractToken, 
    to: string, 
    amount: string
) {
    const privateKey = Buffer.from(selectedWallet.privateKey.replace('0x', ''), 'hex')
    const provider = new ethers.providers.JsonRpcProvider(selectedNetwork.api)
    const nonce = await provider.getTransactionCount(selectedWallet.address)
    const gasPrice = await getGasPrice(provider)
    // const contract = new Contract(token.address, ABI[token.chainType], provider)
    const serializedTx = signTx(privateKey, token, to, amount, gasPrice, nonce)
    const res = await broadTx(provider, serializedTx)
    return res.hash
}

function getTransactions() {
    
}