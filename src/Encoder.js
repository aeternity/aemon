import RLP from 'rlp'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import PrimitivesEncoder from './PrimitivesEncoder.js'
import Structures from './Serializers/ChainObjects/Structures.js'
import ChainObject from './ChainObjects/ChainObject.js'
import ObjectTags from './ChainObjects/ObjectTags.js'

export default class Encoder {
    constructor() {
        this.textEnoder = new TextEncoder()
        this.textDecoder = new TextDecoder()
        this.apiEncoder = new FateApiEncoder()
        this.primEncoder = new PrimitivesEncoder(this.apiEncoder)

        this.decoders = {
            key_block_hash: (value) => this.apiEncoder.encode('key_block_hash', value),
            micro_block_hash: (value) => this.apiEncoder.encode('micro_block_hash', value),
            block_pof_hash: (value) => this.apiEncoder.encode('block_pof_hash', value),
            block_tx_hash: (value) => this.apiEncoder.encode('block_tx_hash', value),
            block_state_hash: (value) => this.apiEncoder.encode('block_state_hash', value),
            signature: (value) => this.apiEncoder.encode('signature', value),
            peer_pubkey: (value) => this.apiEncoder.encode('peer_pubkey', value),
            account_pubkey: (value) => this.apiEncoder.encode('account_pubkey', value),
            bytearray: (value) => this.apiEncoder.encode('bytearray', value),
            object: (value) => this.decodeObject(value),
        }

        this.encoders = {
            key_block_hash: (value) => this.apiEncoder.decode(value),
            micro_block_hash: (value) => this.apiEncoder.decode(value),
            block_pof_hash: (value) => this.apiEncoder.decode(value),
            block_tx_hash: (value) => this.apiEncoder.decode(value),
            block_state_hash: (value) => this.apiEncoder.decode(value),
            signature: (value) => this.apiEncoder.decode(value),
            peer_pubkey: (value) => this.apiEncoder.decode(value),
            account_pubkey: (value) => this.apiEncoder.decode(value),
            bytearray: (value) => this.apiEncoder.decode(value),
        }
    }

    encode(data, fields) {
        let chunks = []

        for (const field in fields) {
            const [type, _size] = fields[field]
            const encoded = this.encodeField(type, data[field])

            chunks.push(encoded)
        }

        return new Uint8Array(Buffer.concat(chunks))
    }

    decode(data, fields) {
        let chunks = {}
        let idx = 0

        for (const field in fields) {
            const [type, size] = fields[field]
            // console.log('DECODE FIELD:', type, size, field, data.slice(idx, idx+size))
            chunks[field] = this.decodeField(type, data.slice(idx, idx+size))
            idx += size
        }

        return chunks
    }

    encodeField(type, value) {
        if (this.encoders.hasOwnProperty(type)) {
            const encoder = this.encoders[type]

            return encoder(value)
        }

        return this.primEncoder.encode(type, value)
    }

    decodeField(type, value) {
        if (this.decoders.hasOwnProperty(type)) {
            const decoder = this.decoders[type]

            return (Array.isArray(value)) ? value.map(v => decoder(v)) : decoder(value)
        }

        return this.primEncoder.decode(type, value)
    }

    encodeFields(data, fields) {
        const chunks = []

        for (const field in fields) {
            const type = fields[field]
            const encoded = this.encodeField(type, data[field])
            // console.log('ENCODE FIELD:', type, data[field], encoded)

            chunks.push(encoded)
        }

        return chunks
    }

    decodeFields(data, fields) {
        // console.log('STRUCT:', data, fields)
        let chunks = {}
        let idx = 0

        for (const field in fields) {
            const type = fields[field]
            // console.log('DECODE STRUC FIELD:', type, field, data[idx])
            chunks[field] = this.decodeField(type, data[idx])
            idx++
        }

        return chunks
    }

    decodeObject(data) {
        const [tagData, _version, ...rest] = RLP.decode(data)
        const tag = Number(this.decodeField('int', tagData))
        const type = Object.keys(ObjectTags).find(key => ObjectTags[key] === tag)

        if (type === undefined) {
            throw new Error('Unsupported tag: ' + tag)
        }

        if (!Structures.hasOwnProperty(type)) {
            throw new Error('Unsupported type: ' + type)
        }

        const fields = this.decodeFields(rest, Structures[type])

        return new ChainObject(type.toLowerCase(), fields)
    }
}
