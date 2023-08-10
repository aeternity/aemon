import RLP from 'rlp'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import PrimitivesEncoder from './PrimitivesEncoder.js'
import Structures from './Serializers/ChainObjects/Structures.js'
import ChainObject from './ChainObjects/ChainObject.js'
import ObjectTags from './ChainObjects/ObjectTags.js'

/**
 * Object serialization according to a types template that takes care for tags and vsn.
 * Also supports encode and decode data fields according to a template.
 *
*/
export default class ObjectSerializer {
    constructor() {
        this.primEncoder = new PrimitivesEncoder(new FateApiEncoder())
    }

    supports(type) {
        return this.primEncoder.supports(type)
    }

    serialize(tag, vsn, template, fields) {
        const allFields = {tag, vsn, ...fields}
        const fullTemplate = {tag: 'int', vsn: 'int', ...template}
        const data = this.encodeFields(allFields, fullTemplate)

        return [...RLP.encode(data)]
    }

    deserialize(template, data) {
        const objData = RLP.decode(data)
        const fullTemplate = {tag: 'int', vsn: 'int', ...template}
        const {tag, vsn, ...fields} = this.decodeFields(objData, fullTemplate)

        return fields
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

    /**
     * Encode data fields according to a template
     *
     * @param {object} data - An object with field => value items
     * @param {object} template - An object with field => type items
     * @returns {array} A poisioned array of encoded fields with preserved order
    */
    encodeFields(data, template) {
        const chunks = []

        for (const field in template) {
            const type = template[field]
            const encoded = this.#encodeField(type, data[field])

            chunks.push(encoded)
        }

        return chunks
    }

    /**
     * Decode data fields according to a template
     *
     * @param {array} data - An array with positioned values according to the template
     * @param {object} template - An object with field => type items
     * @returns {object} An object with decoded field => value items
    */
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
