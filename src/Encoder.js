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

export default class Encoder {
    constructor() {
        this.textEnoder = new TextEncoder()
        this.textDecoder = new TextDecoder()
        this.apiEncoder = new FateApiEncoder()

        this.decoders = {
            int: this.decodeInt,
            uint_32: this.decodeInt,
            uint_64: this.decodeInt,
            bool: this.decodeBool,
            string: this.decodeString.bind(this),
            binary: this.decodeBinary,
            key_block_hash: (value) => this.apiEncoder.encode('key_block_hash', value),
            micro_block_hash: (value) => this.apiEncoder.encode('micro_block_hash', value),
            block_pof_hash: (value) => this.apiEncoder.encode('block_pof_hash', value),
            block_tx_hash: (value) => this.apiEncoder.encode('block_tx_hash', value),
            block_state_hash: (value) => this.apiEncoder.encode('block_state_hash', value),
            signature: (value) => this.apiEncoder.encode('signature', value),
            account_pubkey: (value) => this.apiEncoder.encode('account_pubkey', value),
        }

        this.encoders = {
            int: this.encodeInt,
            uint_32: (value) => this.encodeTypedInt('uint_32', value),
            uint_64: (value) => this.encodeTypedInt('uint_64', value),
            bool: this.encodeBool,
            string: this.encodeString,
            binary: this.encodeBinary,
            key_block_hash: (value) => this.apiEncoder.decode(value),
            micro_block_hash: (value) => this.apiEncoder.decode(value),
            block_pof_hash: (value) => this.apiEncoder.decode(value),
            block_tx_hash: (value) => this.apiEncoder.decode(value),
            block_state_hash: (value) => this.apiEncoder.decode(value),
            signature: (value) => this.apiEncoder.decode(value),
            account_pubkey: (value) => this.apiEncoder.decode(value),
        }
    }

    encode(data, fields) {
        let chunks = []

        for (const field in fields) {
            const [type, _size] = fields[field]
            const encoded = this.encodeValue(type, data[field])

            chunks.push(encoded)
        }

        return new Uint8Array(Buffer.concat(chunks))
    }

    decode(data, fields) {
        let chunks = {}
        let idx = 0

        for (const field in fields) {
            const [type, size] = fields[field]
            chunks[field] = this.decodeValue(type, data.slice(idx, idx+size))
            idx += size
        }

        return chunks
    }

    encodeValue(type, value) {
        const encoder = this.encoders[type]

        return encoder(value)
    }

    decodeValue(type, value) {
        const decoder = this.decoders[type]
        const decoded = decoder(value)
        return decoder(value)
    }

    encodeInt(value) {
        return Int2ByteArray(value)
    }

    encodeTypedInt(type, value) {
        let dataView

        switch (type) {
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
}
