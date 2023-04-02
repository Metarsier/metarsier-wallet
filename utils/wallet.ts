import { ec } from 'elliptic'
import BN from 'bn.js'
import bs58 from 'bs58'
import CryptoJS from 'crypto-js'
import { Buffer } from 'buffer'
import { NativeModules } from "react-native"
import { keccak256, sha256, ripemd160, isValidMnemonic } from "ethers/lib/utils"
import { hexStrToBuf, uuid } from "."
import { CHAIN_COINTYPE } from '../config'
import { ethers } from 'ethers'

const secp256k1 = new ec('secp256k1')
const n = secp256k1.curve.n

const ZERO32 = Buffer.alloc(32, 0)
const EC_GROUP_ORDER = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex')

const THROW_BAD_PRIVATE = 'Expected Private'
const THROW_BAD_TWEAK = 'Expected Tweak'

const HIGHEST_BIT = 0x80000000

function fromBuffer(d: Buffer) { 
    return new BN(d) 
}
function toBuffer(d: BN) { 
    return d.toArrayLike(Buffer, 'be', 32) 
}

function isScalar(x: Buffer) {
    return Buffer.isBuffer(x) && x.length === 32
}
function isOrderScalar(x: Buffer) {
    if (!isScalar(x)) return false
    return x.compare(EC_GROUP_ORDER) < 0 // < G
  }

function isPrivate(x: Buffer) {
    if (!isScalar(x)) return false
    return x.compare(ZERO32) > 0 && // > 0
      x.compare(EC_GROUP_ORDER) < 0 // < G
}

function privateAdd(d: Buffer, tweak: Buffer) {
    if (!isPrivate(d)) throw new TypeError(THROW_BAD_PRIVATE)
    if (!isOrderScalar(tweak)) throw new TypeError(THROW_BAD_TWEAK)
  
    const dd = fromBuffer(d)
    const tt = fromBuffer(tweak)
    const dt = toBuffer(dd.add(tt).umod(n))
    if (!isPrivate(dt)) return null
    return dt
}

/**
 * 获取路径
 * @param coinType 
 * @param index 
 * @returns 
 */
const getPath = (coinType: number = 0, index: number = 0) => `m/44'/${coinType}'/0'/0/${index}`

/**
 * 根据私钥生成公钥，这里使用椭圆算法 secp256k1
 * @param privateKey 
 * @returns 
 */
const getPubkeyFromPrikey = (privateKey: Buffer): { publicKey: Buffer, compressPublicKey: Buffer } => {
    const key = secp256k1.keyFromPrivate(privateKey)
    const pubKey = key.getPublic()
    const x = pubKey.getX()
    const y = pubKey.getY()
    let xHex = x.toString('hex'), yHex = y.toString('hex')
    while (xHex.length < 64) {
        xHex = `0${xHex}`
    }
    while (yHex.length < 64) {
        yHex = `0${yHex}`
    }
    const yBuffer = Buffer.alloc(yHex.length / 2, yHex, 'hex')
    const yLast = yBuffer[yBuffer.length - 1]
    const prefix = yLast % 2 === 0 ? '0x02' : '0x03'
    const publicKey = hexStrToBuf(`04${xHex}${yHex}`)
    const compressPublicKey = hexStrToBuf(prefix + xHex)
    return { publicKey, compressPublicKey }
}

/**
 * 生成比特币地址
 * @param privateKey 
 * @returns 
 */
 const getBTCAddress = (publicKey: Buffer) => {
    // 这里使用压缩公钥
    const hash: Buffer = hexStrToBuf(ripemd160(sha256(publicKey)))
    // 头部添加版本号0x00
    let initAddress = Buffer.concat([Buffer.alloc(1, '00', 'hex'), hash])
    const hash2 = hexStrToBuf(sha256(sha256(initAddress)))
    const checkSum = hash2.slice(0, 4)
    const address = Buffer.concat([initAddress, checkSum])
    return bs58.encode(address)
}
/**
 * 生成以太坊地址
 * @param privateKey 
 * @returns 
 */
const getETHAddress = (publicKey: Buffer): string => {
    let hash: Buffer = hexStrToBuf(keccak256(publicKey))
    hash = hash.slice(hash.length - 20)
    // // 下面操作为地址大小写区分
    const address = hash.toString('hex').toLowerCase()
    const hash2 = keccak256(Buffer.from(address, 'utf8')).replace(/^0x/, '')
    let result = '0x'
    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash2[i], 16) >= 8) {
            result += address[i].toUpperCase()
        }
        else {
            result += address[i]
        }
    }
    return result
}
/**
 * 生成波场地址
 * @param privateKey 
 * @returns 
 */
const getTRONAddress = (publicKey: Buffer): string => {
    let hash: Buffer = hexStrToBuf(keccak256(publicKey))
    hash = hash.slice(hash.length - 20)
    let initAddress = Buffer.concat([Buffer.alloc(1, '41', 'hex'), hash])
    const hash2 = hexStrToBuf(sha256(sha256(initAddress)))
    const checkSum = hash2.slice(0, 4)
    const address = Buffer.concat([initAddress, checkSum])
    return bs58.encode(address)
}

export const getAddress = (privateKey: Buffer, coinType: number = 0) => {
    let { publicKey, compressPublicKey } = getPubkeyFromPrikey(privateKey)
    if (publicKey.length === 65) {
        publicKey = publicKey.slice(1)
    }
    let address = ''
    if (coinType === 0) {
        address = getBTCAddress(compressPublicKey)
    } else if (coinType === 60) {
        address = getETHAddress(publicKey)
    } else if (coinType === 195) {
        address = getTRONAddress(publicKey)
    }
    return address
}

export function generateMnemonic(): Promise<string> {
    return new Promise((resolve, reject) => {
        NativeModules.MnemonicTools.generate((mnemonic: string) => {
            if (mnemonic) {
                resolve(mnemonic)
            } else {
                reject("Generate failed")
            }
        })
    })
}

export function getSeedFromMnemonic(mnemonic: string): Promise<string> {
    return new Promise((resolve, reject) => {
        NativeModules.MnemonicTools.getSeedFromMnemonic(mnemonic, (seedHex: string) => {
            if (seedHex) {
                resolve(seedHex)
            } else {
                reject("Get seed failed")
            }
        })
    })
}

interface CreateHDWalletProps {
    mnemonic?: string, 
    index?: number
}
/**
 *  创建HD根钱包
 * @param mnemonic  助记词
 * @returns 
 */
 export async function createHDWallet({ mnemonic, index = 0 }: CreateHDWalletProps) {
    mnemonic = mnemonic?.trim()
    if (mnemonic && !isValidMnemonic(mnemonic)) throw new Error("助记词无效")
    let seed: Buffer
    if (!mnemonic) {
        mnemonic = await generateMnemonic()
    }
    const seedHex = await getSeedFromMnemonic(mnemonic)
    seed = hexStrToBuf(seedHex)
    if (seed.length < 16)
        throw new TypeError('Seed should be at least 128 bits')
    if (seed.length > 64)
        throw new TypeError('Seed should be at most 512 bits')
    const seedData = CryptoJS.enc.Hex.parse(seed.toString('hex'))
    const I = hexStrToBuf(CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA512(seedData, 'Bitcoin seed')))
    const IL = I.slice(0, 32)
    const IR = I.slice(32)
    if (!isPrivate(IL)) throw new TypeError(THROW_BAD_PRIVATE)
    const { publicKey, compressPublicKey } = getPubkeyFromPrikey(IL)

    return {
        id: uuid(),
        privateKey: '0x' + IL.toString('hex'),
        publicKey: '0x' + publicKey.toString('hex'),
        compressPublicKey: '0x' + compressPublicKey.toString('hex'),
        chainCode: '0x' + IR.toString('hex'),
        path: 'm',
        mnemonic,
        name: 'HD Wallet',
        address: '',
        type: -1,
        index,
        children: []
    }
}

function derive(this: HDWallet, index: number, chain: string): HDWallet {
    const data = Buffer.allocUnsafe(37)
    const priKey: Buffer = hexStrToBuf(this.privateKey)
    const pubKey: Buffer = hexStrToBuf(this.compressPublicKey)
    // Hardened child
    if (index >= HIGHEST_BIT) {
        if (!this.privateKey)
            throw new TypeError('Missing private key for hardened child key')
        // data = 0x00 || ser256(kpar) || ser32(index)
        data[0] = 0x00
        priKey.copy(data, 1)
        data.writeUInt32BE(index, 33)
        // Normal child
    } else {
        // data = serP(point(kpar)) || ser32(index)
        //      = serP(Kpar) || ser32(index)
        pubKey.copy(data, 0)
        data.writeUInt32BE(index, 33)
    }
    const chainCode = CryptoJS.enc.Hex.parse(this.chainCode.replace(/^0x/, ''))
    const dKey = CryptoJS.enc.Hex.parse(data.toString('hex'))
    const I = hexStrToBuf(CryptoJS.HmacSHA512(dKey, chainCode).toString(CryptoJS.enc.Hex))
    const IL = I.slice(0, 32)
    const IR = I.slice(32)
    let ki: Buffer = Buffer.alloc(1), Ki = Buffer.alloc(1)
    if (this.privateKey) {
        ki = privateAdd(priKey, IL) as Buffer
        // In case privateKey == 0, proceed with the next value for i
        if (!ki) return derive.call(this, index + 1, chain)
    } else {
        // ki = pointAddScalar(this.publicKey, IL, true)
        // TODO 这里应该是用 pointAddScalar，而不是 privateAdd
        Ki = privateAdd(priKey, IL) as Buffer
        if (!Ki) return derive.call(this, index + 1, chain)
    }

    const coinType: number = CHAIN_COINTYPE[chain]
    const { publicKey, compressPublicKey } = getPubkeyFromPrikey(ki)
    const address = getAddress(ki, coinType)
    return {
        id: uuid(),
        privateKey: '0x' + ki.toString('hex'),
        publicKey: '0x' + publicKey.toString('hex'),
        compressPublicKey: '0x' + compressPublicKey.toString('hex'),
        chainCode: '0x' + IR.toString('hex'),
        path: getPath(coinType, index),
        name: chain + ' Wallet',
        address,
        type: coinType,
        chain,
        index,
        children: []
    }
}

/**
 * 派生子钱包
 * @param privateKey 
 * @param chainCode 
 * @param coinType 
 * @param index 
 * @returns 
 */
 export function deriveWallet(parent: HDWallet, chain: string = 'Ethereum', index: number = 0): HDWallet {
    const coinType: number = CHAIN_COINTYPE[chain]
    const derivePath = getPath(coinType, index)
    let splitPath = derivePath.split('/')
    if (splitPath[0] === 'm') {
        splitPath = splitPath.slice(1)
    }
    let result: HDWallet = parent
    for (let i = 0; i < splitPath.length; i++) {
        const component = splitPath[i]
        if (component.match(/^[0-9]+'$/)) {
            const idx = parseInt(component.substring(0, component.length - 1))
            if (idx >= HIGHEST_BIT) { throw new Error("invalid path index - " + component) }
            result = derive.call(result, HIGHEST_BIT + idx, chain)
        } else if (component.match(/^[0-9]+$/)) {
            const idx = parseInt(component)
            if (idx >= HIGHEST_BIT) { throw new Error("invalid path index - " + component) }
            result = derive.call(result, idx, chain)
        } else {
            throw new Error("invalid path component - " + component)
        }
    }
    result.parentId = parent.id
    return result
}

/**
 * coinType 必须要传入，因为每个币种的钱包生成path不一样，
 * 虽然任意币种都可以用相同的私钥，但是不符合路径规范，与其他钱包不通用
 * @param privateKey 
 * @param coinType 
 * @returns 
 */
export function createWalletByPrivateKey(privateKey: string, chain: string, index: number = 0): HDWallet {
    const coinType = CHAIN_COINTYPE[chain]
    const privKey: Buffer = hexStrToBuf(privateKey)
    const { publicKey, compressPublicKey } = getPubkeyFromPrikey(privKey)
    const address = getAddress(privKey, coinType)
    return {
        id: uuid(),
        privateKey: privateKey.startsWith('0x') ? privateKey : '0x' + privateKey,
        publicKey: '0x' + publicKey.toString('hex'),
        compressPublicKey: '0x' + compressPublicKey.toString('hex'),
        chainCode: '',
        address,
        name: chain + ' Wallet',
        type: coinType,
        chain,
        index
    }
}
