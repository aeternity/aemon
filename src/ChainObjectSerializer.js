import RLP from 'rlp'
import Structures from './Serializers/ChainObjects/Structures.js'
import ChainObject from './ChainObjects/ChainObject.js'
import ObjectTags from './ChainObjects/ObjectTags.js'
import PrimitivesEncoder from './PrimitivesEncoder.js'

const TYPE2SIZE = {
    uint_32: 4,
    uint_64: 8,
    account_pubkey: 32,
    key_block_hash: 32,
    micro_block_hash: 32,
    block_pof_hash: 32,
    block_tx_hash: 32,
    block_state_hash: 32,
    signature: 64,
    pow: 168,
}

export default class ChainObjectSerializer {
    constructor(serializerTemplate) {
        this.serializerTemplate = serializerTemplate
        this.primEncoder = new PrimitivesEncoder()
    }

    serialize(chainObject) {
        // console.log('object', chainObject)

        const template = Structures[chainObject.name.toUpperCase()]
        // console.log('template', template)

        const serializedFields = this.#serializeFields(chainObject.tag, chainObject.vsn, template, chainObject)
        // console.log('serializedFields', serializedFields)

        return new Uint8Array(serializedFields)
    }

    deserialize(data) {
        // console.log('ChainObjectSerializer deserialize data:')
        // console.dir(data, {maxArrayLength: null})
        const {tag, vsn, rest} = this.#deserializeHeader(data)
        const type = Object.keys(ObjectTags).find(key => ObjectTags[key] === Number(tag))

        if (type === undefined) {
            throw new Error(`Unsupported object tag: ${tag}`)
        }

        if (!Structures.hasOwnProperty(type)) {
            return new ChainObject(type.toLowerCase(), {})
        }

        const template = Structures[type]
        const fields = this.decodeFields(rest, template)

        return new ChainObject(type.toLowerCase(), {vsn, ...fields})
    }

    #deserializeHeader(data) {
        const objData = RLP.decode(data)
        const template = {tag: 'int', vsn: 'int'}

        const {tag, vsn} = this.decodeFields(objData, template)
        const rest = objData.slice(2)

        return {tag, vsn, rest}
    }

    #serializeFields(tag, vsn, template, fields) {
        const allFields = {tag, vsn, ...fields}
        const fullTemplate = {tag: 'int', vsn: 'int', ...template}
        const data = this.encodeFields(allFields, fullTemplate)

        return [...RLP.encode(data)]
    }

    #deserializeFields(template, data) {
        const objData = RLP.decode(data)
        const fullTemplate = {tag: 'int', vsn: 'int', ...template}
        const {tag, vsn, ...fields} = this.decodeFields(objData, fullTemplate)

        return fields
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
            // console.log('encode field iter: ', field, type, data[field])
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
        // console.log('decode fields:', data, template)
        let chunks = {}
        let idx = 0

        for (const field in template) {
            const type = template[field]
            // console.log('this.#decodeField iter: ', field, type, data[idx])
            chunks[field] = this.#decodeField(type, data[idx])
            idx++
        }

        return chunks
    }

    #encodeField(typeInfo, value) {
        if (Array.isArray(typeInfo)) {
            return value.map(v => this.#encodeField(typeInfo[0], v))
        }

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            const {type, template} = typeInfo

            return new Uint8Array(this.encodeFields(value, template).flatMap(e => [...e]))
        }

        if (this.primEncoder.supports(typeInfo)) {
            return this.primEncoder.encode(typeInfo, value)
        }

        return this.serializerTemplate.encode(typeInfo, value)

    }

    #decodeField(typeInfo, value) {
        if (Array.isArray(typeInfo)) {
            return value.map(v => this.#decodeField(typeInfo[0], v))
        }

        if (Object.getPrototypeOf(typeInfo) === Object.prototype) {
            const {type, template} = typeInfo
            const objectFields = this.splitFields(value, template)
            // console.log('objectFields', objectFields)
            return this.decodeFields(objectFields, template)
        }

        if (this.primEncoder.supports(typeInfo)) {
            return this.primEncoder.decode(typeInfo, value)
        }

        return this.serializerTemplate.decode(typeInfo, value)
    }

    #sizeOf(type) {
        // console.log('sizeOf', type)
        // most (all?) chain objects does not have fixed size
        // thus they can be nested in other objects only as last field
        // size of Infinity would split all the rest bytes to that field
        if (type === 'chain_object') {
            return Infinity
        }

        if (Object.getPrototypeOf(type) === Object.prototype) {
            let objectSize = 0
            for (const field in type.template) {
                objectSize += this.#sizeOf(type.template[field])
            }

            return objectSize
        }

        if (!TYPE2SIZE.hasOwnProperty(type)) {
            throw new Error(`Unknown size of type "${type}"`)
        }

        return TYPE2SIZE[type]
    }

    sizeOfObject(objectName) {
        const template = Structures[objectName.toUpperCase()]
        let size = 0

        for (const field in template) {
            size += this.#sizeOf(template[field])
        }

        return size
    }

    encodeObject(object) {
        const template = Structures[object.name.toUpperCase()]
        const encoded = this.encodeFields(object, template)

        // console.log('encoded fields', encoded)

        return new Uint8Array(encoded.flatMap(e => [...e]))
    }

    // Decoding a fixed size object
    // alternative compared to fields based decoding above
    // works based on object field sizes used to split on fields
    decodeObject(name, data) {
        // console.log('decodeObject', name, data)
        const template = Structures[name.toUpperCase()]
        const binaryFields = this.splitFields(data, template)
        // console.log('splitted binaryFields', binaryFields)
        const fields = this.decodeFields(binaryFields, template)

        return new ChainObject(name, fields)
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

    splitFieldsToObject(stream, template) {
        let fields = {}
        let idx = 0

        for (const field in template) {
            const size = this.#sizeOf(template[field])
            fields[field] = stream.slice(idx, idx+size)
            idx += size
        }

        return fields
    }
}
