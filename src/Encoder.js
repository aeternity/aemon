import RLP from 'rlp'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import PrimitivesEncoder from './PrimitivesEncoder.js'
import ObjectSerializer from './ObjectSerializer.js'
import Structures from './Serializers/ChainObjects/Structures.js'
import ChainObject from './ChainObjects/ChainObject.js'
import ObjectTags from './ChainObjects/ObjectTags.js'
import ChainObjectSerializer from './ChainObjectSerializer.js'
import SerializerTemplate from './SerializerTemplate.js'

const objMap = (obj, fn) => {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => {
        return [k, fn(k, v)]
    }))
}

export default class Encoder {
    constructor() {
        this.apiEncoder = new FateApiEncoder()
        this.primEncoder = new PrimitivesEncoder(this.apiEncoder)
        this.objectSerializer = new ObjectSerializer()

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
            object: (value) => this.chainObjectSerializer.deserialize(value),
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

        this.serializerTemplate = new SerializerTemplate(this.encoders, this.decoders)
        this.chainObjectSerializer = new ChainObjectSerializer(this.serializerTemplate)
    }

    serialize(tag, vsn, template, fields) {
        const binaryFields = this.serializerTemplate.fieldsToBinary(template, fields)
        const serializerTemplate = this.serializerTemplate.getTemplate(template)
        const serializedFields = this.objectSerializer.encodeFields(binaryFields, serializerTemplate)

        return RLP.encode(serializedFields)
    }

    deserialize(template, binaryData) {
        const fieldsBin = RLP.decode(binaryData)
        const deserializerTemplate = this.serializerTemplate.getTemplate(template)
        const data = this.objectSerializer.decodeFields(fieldsBin, deserializerTemplate)

        return this.serializerTemplate.binaryToFields(template, data)
    }

    //split to own class?
    //convert to supported by ObjectSerializer structure and reuse it?
    encode(data, fields) {
        let chunks = []

        for (const field in fields) {
            const [type, _size] = fields[field]
            const encoded = this.#encodeField(type, data[field])

            chunks.push(encoded)
        }

        return new Uint8Array(Buffer.concat(chunks))
    }

    decode(data, fields) {
        let chunks = {}
        let idx = 0

        for (const field in fields) {
            const [type, size] = fields[field]
            chunks[field] = this.#decodeField(type, data.slice(idx, idx+size))
            idx += size
        }

        return chunks
    }

    #encodeField(type, value) {
        if (this.encoders.hasOwnProperty(type)) {
            const encoder = this.encoders[type]

            return (Array.isArray(type)) ? value.map(v => encoder(v)) : encoder(value)
        }

        return this.primEncoder.encode(type, value)
    }

    #decodeField(type, value) {
        if (this.decoders.hasOwnProperty(type)) {
            const decoder = this.decoders[type]

            return (Array.isArray(value)) ? value.map(v => decoder(v)) : decoder(value)
        }

        return this.primEncoder.decode(type, value)
    }
}
