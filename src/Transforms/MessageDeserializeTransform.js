import stream from 'stream'
import MessageEncoder from '../Messages/Encoder/MessageEncoder.js'
import SerializerError from './SerializerError.js'

export default class MessageDeserializeTransform extends stream.Transform {
    constructor(_options) {
        super({
            objectMode: true,
        })

        this.encoder = new MessageEncoder()
    }

    _transform(chunk, _encoding, callback) {
        try {
            const message = this.encoder.decode(chunk)
            this.push(message)
            callback()
        } catch (e) {
            callback(new SerializerError('DESERIALIZE', chunk))
        }
    }
}
