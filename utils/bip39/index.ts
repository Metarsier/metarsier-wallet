import { randomBytes } from 'react-native-randombytes'
import { Buffer } from 'buffer'
import { SHA3 } from 'sha3'
import pbkdf2 from 'pbkdf2'
import _wordlists from './wordlists' 
let DEFAULT_WORDLIST = _wordlists.english
const INVALID_MNEMONIC: string = 'Invalid mnemonic'
const INVALID_ENTROPY: string = 'Invalid entropy'
const INVALID_CHECKSUM: string = 'Invalid mnemonic checksum'
const WORDLIST_REQUIRED: string = 'A wordlist is required but a default could not be found.\n' +
    'Please pass a 2048 word array explicitly.'


function lpad(str: string, padString: string, length: number) {
    while (str.length < length) {
        str = padString + str
    }
    return str
}
function binaryToByte(bin: string) {
    return parseInt(bin, 2)
}
function bytesToBinary(bytes: number[]) {
    return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('')
}
function deriveChecksumBits(entropyBuffer: Buffer) {
    const ENT = entropyBuffer.length * 8
    const CS = ENT / 32
    const hash = new SHA3(256).update(entropyBuffer).digest()
    return bytesToBinary(Array.from(hash)).slice(0, CS)
}

function salt(password: string) {
    return 'mnemonic' + (password || '')
}

function normalize(str?: string) {
    return (str || '').normalize('NFKD')
}

function entropyToMnemonic(entropy: Buffer, word?: string) {
    if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex')
    }
    const _wordlist = word ? _wordlists[word] : DEFAULT_WORDLIST
    if (!_wordlist) {
        throw new Error(WORDLIST_REQUIRED)
    }
    // 128 <= ENT <= 256
    if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY)
    }
    if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY)
    }
    if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY)
    }
    const entropyBits = bytesToBinary(Array.from(entropy))
    const checksumBits = deriveChecksumBits(entropy)
    const bits = entropyBits + checksumBits
    const chunks = bits.match(/(.{1,11})/g)
    if (!chunks) {
        throw new Error('Chunks error')
    }
    const words = chunks.map((binary) => {
        const index = binaryToByte(binary)
        return _wordlist?.[index]
    })
    return _wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
        ? words.join('\u3000')
        : words.join(' ')
}


export function mnemonicToSeedSync(mnemonic: string, password?: string) {
    const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
    const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8')
    return pbkdf2.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512')
}

// export function generateMnemonic(strength?: number, rng?: (n: number) => Buffer, word?: string) {
//     strength = strength || 128
//     if (strength % 32 !== 0) {
//         throw new TypeError(INVALID_ENTROPY)
//     }
//     rng = rng || randomBytes
//     return entropyToMnemonic(rng(strength / 8), word)
// }