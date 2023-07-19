import RLP from 'rlp'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import PrimitivesEncoder from './PrimitivesEncoder.js'
import Structures from './Serializers/ChainObjects/Structures.js'
import ChainObject from './ChainObjects/ChainObject.js'
import ObjectTags from './ChainObjects/ObjectTags.js'

export default class ObjectSerializer {
    constructor() {
        this.textEnoder = new TextEncoder()
        this.textDecoder = new TextDecoder()
        this.primEncoder = new PrimitivesEncoder(new FateApiEncoder())
    }

    supports(type) {
        return this.primEncoder.supports(type)
    }

    serialize(tag, vsn, template, fields) {
        const allFields = {tag, ...fields}
        const data = this.encodeFields(allFields, template)

        return [0x0, tag, ...RLP.encode(data)]
    }

    deserialize(template, data) {
        const objData = RLP.decode(data)

        return this.decodeFields(objData, template)
    }

    deserializeHeader(data) {
        const objData = RLP.decode(data)
        const template = {tag: 'int', vsn: 'int'}

        const {tag, vsn} = this.decodeFields(objData, template)
        const rest = objData.slice(2)

        return {tag, vsn, rest}
    }

    #encodeField(type, value) {
        if (Array.isArray(type)) {
            return value.map(v => this.#encodeField(type[0], v))
        }

        if (typeof type === 'object') {
            return RLP.encode(this.encodeFields(value, type))
        }

        return this.primEncoder.encode(type, value)
    }

    #decodeField(type, value) {
        if (Array.isArray(type)) {
            return value.map(v => this.#decodeField(type[0], v))
        }

        if (typeof type === 'object') {
            return this.decodeFields(RLP.decode(value), type)
        }

        return this.primEncoder.decode(type, value)
    }

    encodeFields(data, template) {
        const chunks = []

        for (const field in template) {
            const type = template[field]
            const encoded = this.#encodeField(type, data[field])

            chunks.push(encoded)
        }

        return chunks
    }

    decodeFields(data, template) {
        let chunks = {}
        let idx = 0

        for (const field in template) {
            const type = template[field]
            chunks[field] = this.#decodeField(type, data[idx])
            idx++
        }

        return chunks
    }
}
