import {FateApiEncoder} from '@aeternity/aepp-calldata'
import ChainObjectSerializer from './ChainObjectSerializer.js'
import IdEncoder from './IdEncoder.js'

const TYPE2SIZE = {
    uint_32: 4,
    uint_64: 8,
    key_block_hash: 32,
    micro_block_hash: 32,
    block_pof_hash: 32,
    block_tx_hash: 32,
    block_state_hash: 32,
    signature: 64,
}

const objMap = (obj, fn) => {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => {
        return [k, fn(k, v)]
    }))
}

//BinaryFieldsEncoder?
export default class SerializerTemplate {
    constructor(additionalEncoders, additionalDecoders) {
        this.apiEncoder = new FateApiEncoder()
        this.idEncoder = new IdEncoder(this.apiEncoder)
        this.chainObjectSerializer = new ChainObjectSerializer(this)

        this.decoders = {
            key_block_hash: (value) => this.apiEncoder.encode('key_block_hash', value),
            micro_block_hash: (value) => this.apiEncoder.encode('micro_block_hash', value),
            block_pof_hash: (value) => this.apiEncoder.encode('block_pof_hash', value),
            block_tx_hash: (value) => this.apiEncoder.encode('block_tx_hash', value),
            block_state_hash: (value) => this.apiEncoder.encode('block_state_hash', value),
            signature: (value) => this.apiEncoder.encode('signature', value),
            peer_pubkey: (value) => this.apiEncoder.encode('peer_pubkey', value),
            account_pubkey: (value) => this.apiEncoder.encode('account_pubkey', value),
            tx_hash: (value) => this.apiEncoder.encode('transaction_hash', value),
            bytearray: (value) => this.apiEncoder.encode('bytearray', value),
            id: (value) => this.idEncoder.encode(value),
            chain_object: (value) => this.chainObjectSerializer.deserialize(value),
            binary_chain_object: (value, params) => this.chainObjectSerializer.decodeObject(params.objectName, value),
            ...additionalDecoders
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
            tx_hash: (value) => this.apiEncoder.decode(value),
            bytearray: (value) => this.apiEncoder.decode(value),
            id: (value) => this.idEncoder.decode(value),
            chain_object: (value) => this.chainObjectSerializer.serialize(value),
            binary_chain_object: (value, params) => this.chainObjectSerializer.encodeObject(value),
            ...additionalEncoders
        }
    }

    encode(type, value, params) {
        return this.encoders.hasOwnProperty(type) ? this.encoders[type](value, params) : value
    }

    decode(type, value, params) {
        return this.decoders.hasOwnProperty(type) ? this.decoders[type](value, params) : value
    }

    #sizeOf(type) {
        if (!TYPE2SIZE.hasOwnProperty(type)) {
            throw new Error(`Unknown size of type "${type}"`)
        }

        return TYPE2SIZE[type]
    }

    // Split data stream into fields based on their size
    splitFields(stream, template) {
        let fields = []
        let idx = 0

        for (const field in template) {
            const size = this.#sizeOf(template[field])
            fields.push(stream.slice(idx, idx+size))
            idx += size
        }

        return fields
    }

    //toBinaryTemplate
    getTemplate(template) {
        return objMap(template, (k, v) => {
            if (Array.isArray(v)) {
                if (typeof v[0] === 'object') {
                    return v.map(e => this.getTemplate(e))
                }

                return v.map(e => this.decoders.hasOwnProperty(e) ? 'binary' : e)
            }

            // POJO check
            if (Object.getPrototypeOf(v) === Object.prototype) {
                return this.getTemplate(v)
            }

            return this.decoders.hasOwnProperty(v) ? 'binary' : v
        })
    }

    fieldsToBinary(template, data) {
        // console.log('fieldsToBinary', template, data)
        return objMap(template, (field, type) => this.fieldToBinary(type, data[field]))
    }

    fieldToBinary(typeInfo, value) {
        let type = typeInfo
        let template = {}
        let params = {}

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            ({type, template, params} = typeInfo)
        }

        if (Array.isArray(type)) {
            return value.map(v => this.fieldToBinary(type[0], v))
        }

        // POJO check
        if (type === 'object') {
            return this.fieldsToBinary(template, value)
        }

        // console.log('fieldToBinary encode', type, value, params)

        return this.encode(type, value, params)
    }

    binaryToFields(template, data) {
        // console.log('binaryToFields', template, data)
        const transformed = objMap(template, (field, type) => this.binaryToField(type, data[field]))

        return {...data, ...transformed}
    }

    binaryToField(typeInfo, value) {
        let type = typeInfo
        let template = {}
        let params = {}

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            ({type, template, params} = typeInfo)
        }

        if (Array.isArray(type)) {
            return value.map(v => this.binaryToField(type[0], v))
        }

        if (type === 'object') {
            return this.binaryToFields(template, value)
        }

        // console.log('binaryToField decode', type, value, params)

        return this.decode(type, value, params)
    }
}
