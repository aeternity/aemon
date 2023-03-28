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

export default class Encoder {
    // static INT = Symbol('int')

    constructor() {
        this.textEnoder = new TextEncoder()
        this.textDecoder = new TextDecoder()
    }

    encode(type, value) {
        if (type === 'int') {

        }
    }

    encodeInt(value) {
        return Int2ByteArray(value)
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
}
