import Decimal from 'decimal.js-light'
import TronWeb from 'tronweb'

export async function signTx(
    tronWeb: TronWeb,
    token: ContractToken,
    to: string, 
    amount: number, 
    from: string
) {
    const isContract = token.address !== '0x0'
    let tradeobj
    if (isContract) {
        const functionSelector = "transfer(address,uint256)"
        const options = {
            shouldPollResponse: false,
            feeLimit: tronWeb.toSun(30)
        }
        const parameter = [
            { type: "address", value: to },
            { type: "uint256", value: new Decimal(amount).times(new Decimal(10).pow(token.decimals)).toNumber() }
        ]
        const res = await tronWeb.transactionBuilder.triggerSmartContract(token.address, functionSelector, options, parameter)
        tradeobj = res.transaction
    } else {
        tradeobj = await tronWeb.transactionBuilder.sendTrx(to, tronWeb.toSun(amount), from)
    }
    const signedTX = await tronWeb.trx.sign(tradeobj)
    return signedTX
}

export async function broadTx(tronWeb: TronWeb, signedTX: any) {
    const res = await tronWeb.trx.sendRawTransaction(signedTX)
    return res
}

export async function transfer(
    selectedWallet: HDWallet, 
    selectedNetwork: Network, 
    token: ContractToken, 
    to: string, 
    amount: string
) {
    const apiSplit = selectedNetwork.api.split('.io/')
    const api = apiSplit[0] + '.io'
    const apiKey = apiSplit[1]
    const tronWeb = new TronWeb({ 
        fullHost: api, 
        solidityNode: api, 
        headers: { "TRON-PRO-API-KEY": apiKey },
        privateKey: selectedWallet.privateKey.replace(/^(0x)/, '')
    })
    const signedTX = await signTx(tronWeb, token, to, +amount, selectedWallet.address)
    const res = await broadTx(tronWeb, signedTX)
    return res.transaction.txID
}