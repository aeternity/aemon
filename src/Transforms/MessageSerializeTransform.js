import stream from 'stream'
import MessageEncoder from '../Messages/Encoder/MessageEncoder.js'
import SerializerError from './SerializerError.js'

export default class MessageSerializeTransform extends stream.Transform {
    constructor(_options) {
        super({
            objectMode: true,
        })

        this.encoder = new MessageEncoder()
    }

    _transform(message, _encoding, callback) {
        try {
            const serialized = this.encoder.encode(message)
            this.push(serialized)
            callback()
        } catch (e) {
            callback(new SerializerError('SERIALIZE', message))
        }
    }
}
