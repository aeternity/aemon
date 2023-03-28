import stream from 'stream'
import MessageSerializer from '../MessageSerializer.js'

export default class MessageSerializeTransform extends stream.Transform {
    constructor(options) {
        super({
            objectMode: true,
        })

        this.serializer = new MessageSerializer()
    }

    _transform(message, encoding, callback) {
        // console.log('DEBUG: message:', message)
        const serialized = this.serializer.serialize(message)
        // console.log('Serialized message: ', serialized)
        this.push(serialized)

        callback()
    }
}
