import stream from 'stream'
import MessageEncoder from '../MessageEncoder.js'
import SerializerError from '../SerializerError.js'

export default class MessageSerializeTransform extends stream.Transform {
    constructor(options) {
        super({
            objectMode: true,
        })

        this.encoder = new MessageEncoder()
    }

    _transform(message, encoding, callback) {
        try {
            // console.log('DEBUG: message:', message)
            const serialized = this.encoder.encode(message)
            this.push(serialized)
            callback()
        } catch (e) {
            callback(new SerializerError('SERIALIZE', message))
        }
    }
}
