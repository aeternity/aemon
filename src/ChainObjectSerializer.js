import Structures from './Serializers/ChainObjects/Structures.js'
import ChainObject from './ChainObjects/ChainObject.js'
import ObjectTags from './ChainObjects/ObjectTags.js'
import ObjectSerializer from './ObjectSerializer.js'

export default class ChainObjectSerializer {
    constructor(serializerTemplate) {
        this.serializerTemplate = serializerTemplate
        this.objectSerializer = new ObjectSerializer()
    }

    deserialize(data) {
        const {tag, vsn, rest} = this.objectSerializer.deserializeHeader(data)
        const type = Object.keys(ObjectTags).find(key => ObjectTags[key] === Number(tag))

        if (type === undefined) {
            throw new Error(`Unsupported object tag: ${tag}`)
        }

        if (!Structures.hasOwnProperty(type)) {
            return new ChainObject(type.toLowerCase(), {})
        }

        const deserializerTemplate = this.serializerTemplate.getTemplate(Structures[type])
        const decodedData = this.objectSerializer.decodeFields(rest, deserializerTemplate)
        const fields = this.serializerTemplate.binaryToFields(Structures[type], decodedData)

        return new ChainObject(type.toLowerCase(), fields)
    }
}
