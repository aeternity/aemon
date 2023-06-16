import stream from 'stream'
import MessageSerializer from '../MessageSerializer.js'
import SerializerError from '../SerializerError.js'

export default class MessageSerializeTransform extends stream.Transform {
    constructor(options) {
        super({
            objectMode: true,
        })

        this.serializer = new MessageSerializer()
    }

    _transform(message, encoding, callback) {
        try {
            // console.log('DEBUG: message:', message)
            const serialized = this.serializer.serialize(message)
            // console.log('Serialized message: ', serialized)
            this.push(serialized)
            callback()
        } catch (e) {
            callback(new SerializerError('SERIALIZE', message))
        }
    }
}
