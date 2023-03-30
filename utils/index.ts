import Decimal from 'decimal.js-light'
import { Buffer } from "buffer"
import { createHDWallet, deriveWallet } from './wallet'
import { randomBytes } from 'ethers/lib/utils'

export const hideAddress = (address: string) => {
    const first = address.substr(0, 10)
    const last = address.substr(address.length - 8)
    return first + '...' + last
}

export const fixBalance = (balance: string | number) => {
    const str = new Decimal(balance ?? '0').toFixed(6)
}

/**
 * 16进制转Buffer
 * @param str 
 * @returns 
 */
export const hexStrToBuf = (str: string): Buffer => {
    str = str.replace(/^0x/, '')
    const buf = Buffer.alloc(Math.ceil(str.length / 2), str, 'hex')
    return buf
}

export async function createWalletByMnemonic(wallets: HDWallet[], mnemonic?: string) {
    let index = 0
    const roots = wallets.filter((item: HDWallet) => item.type === -1)
    if (roots.length) {
        const maxIndex = Math.max(...roots.map((item: HDWallet) => item.index))
        index = maxIndex + 1
    }
    const root: HDWallet = await createHDWallet({ mnemonic, index })
    // 默认创建以太坊钱包和波场
    // const btc = deriveWallet(root, 'Bitcoin')
    const eth = deriveWallet(root, 'Ethereum')
    const trx = deriveWallet(root, 'Tron')
    return [root, eth, trx]
}

export function uuid(size: number = 16) {
    return Buffer.from(randomBytes(size)).toString('hex')
}
