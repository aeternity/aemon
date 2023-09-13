import {FateApiEncoder} from '@aeternity/aepp-calldata'
import ChainObjectSerializer from '../ChainObjects/ChainObjectSerializer.js'
import IdEncoder from '../IdEncoder.js'

export default class FieldEncoder {
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
            tx_hash: (value) => this.apiEncoder.encode('tx_hash', value),
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
}
