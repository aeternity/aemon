import {FateApiEncoder} from '@aeternity/aepp-calldata'

const Int2ByteArray = (value) => {
    const bigInt = BigInt(value)

    if (bigInt < 256n) {
        return new Uint8Array([Number(bigInt)])
    }

    return new Uint8Array([
        ...Int2ByteArray(bigInt >> 8n),
        Number(bigInt & 0xffn)
    ])
}

const ByteArrayToHexArray = (data) => {
    return [...data].map(x => x.toString(16).padStart(2, '0'))
}

const ByteArray2Int = (data) => {
    const hex = ByteArrayToHexArray(data)

    return BigInt('0x' + hex.join(''))
}

// this is overlaping with general calldata Serializer with some extras: uint_* and id
export default class PrimitivesEncoder {
    constructor() {
        this.textEnoder = new TextEncoder()
        this.textDecoder = new TextDecoder()
        this.apiEncoder = new FateApiEncoder()

        this.decoders = {
            int: this.decodeInt,
            uint_16: this.decodeInt,
            uint_32: this.decodeInt,
            uint_64: this.decodeInt,
            bool: this.decodeBool,
            string: this.decodeString.bind(this),
            binary: this.decodeBinary,
            id: this.decodeId.bind(this),
        }

        this.encoders = {
            int: this.encodeInt,
            uint_16: (value) => this.encodeTypedInt('uint_16', value),
            uint_32: (value) => this.encodeTypedInt('uint_32', value),
            uint_64: (value) => this.encodeTypedInt('uint_64', value),
            bool: this.encodeBool,
            string: this.encodeString.bind(this),
            binary: this.encodeBinary,
        }
    }

    supports(type) {
        return this.decoders.hasOwnProperty(type)
    }

    encode(type, value) {
        if (!this.encoders.hasOwnProperty(type)) {
            throw new Error('Unsupported encoder type: ' + type)
        }

        const encoder = this.encoders[type]

        return (Array.isArray(value)) ? value.map(v => encoder(v)) : encoder(value)
    }

    decode(type, value) {
        if (!this.decoders.hasOwnProperty(type)) {
            throw new Error('Unsupported decode type: ' + type)
        }

        const decoder = this.decoders[type]

        return (Array.isArray(value)) ? value.map(v => decoder(v)) : decoder(value)
    }

    encodeInt(value) {
        return Int2ByteArray(value)
    }

    encodeTypedInt(type, value) {
        let dataView

        switch (type) {
            case 'uint_16':
                dataView = new DataView(new ArrayBuffer(2))
                dataView.setUint16(0, Number(value))
                break;
            case 'uint_32':
                dataView = new DataView(new ArrayBuffer(4))
                dataView.setUint32(0, Number(value))
                break;
            case 'uint_64':
                dataView = new DataView(new ArrayBuffer(8))
                dataView.setBigUint64(0, value)
                break;
            default:
                throw new Error('Unsupported int type')
        }

        return new Uint8Array(dataView.buffer)
    }

    decodeInt(value) {
        return ByteArray2Int(value)
    }

    encodeBool(value) {
        return new Uint8Array((value === true) ? [0x01] : [0x00])
    }

    decodeBool(buffer) {
        if (!buffer instanceof Uint8Array) {
            throw new Error('Invalid buffer type, expected Uint8Array')
        }

        if (buffer[0] === 0x00) {
            return false
        }

        if (buffer[0] === 0x01) {
            return true
        }

        throw new Error('Invalid bool value')
    }

    encodeString(value) {
        return this.textEnoder.encode(value)
    }

    decodeString(buffer) {
        if (!buffer instanceof Uint8Array) {
            throw new Error('Invalid buffer type, expected Uint8Array')
        }

        return this.textDecoder.decode(buffer)
    }

    encodeBinary(value) {
        if (typeof value === 'string' || value instanceof String) {
            const encoder = new TextEncoder()

            return encoder.encode(value)
        }

        if (!value instanceof Uint8Array) {
            throw new Error('Invalid value type, expected Uint8Array')
        }

        return value
    }

    decodeBinary(buffer) {
        if (!buffer instanceof Uint8Array) {
            throw new Error('Invalid buffer type, expected Uint8Array')
        }

        return buffer
    }

    decodeId(value) {
        const [tag, ...rest] = value

        switch (tag) {
            case 1:
                return this.apiEncoder.encode('account_pubkey', rest)
            case 2:
                return this.apiEncoder.encode('name', rest)
            case 3:
                return this.apiEncoder.encode('commitment', rest)
            case 4:
                return this.apiEncoder.encode('oracle_pubkey', rest)
            case 5:
                return this.apiEncoder.encode('contract_pubkey', rest)
            case 6:
                return this.apiEncoder.encode('channel', rest)
            default:
                throw new Error('Unsupported ID tag: ' + tag)
        }
    }
}
