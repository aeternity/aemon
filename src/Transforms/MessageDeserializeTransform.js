import stream from 'stream'
import MessageSerializer from '../MessageSerializer.js'
import SerializerError from '../SerializerError.js'

export default class MessageDeserializeTransform extends stream.Transform {
    constructor(options) {
        super({
            objectMode: true,
        })

        this.serializer = new MessageSerializer()
    }

    _transform(chunk, encoding, callback) {
        try {
            // console.log('Deserializing message: ', chunk)
            const message = this.serializer.deserialize(chunk)
            // console.log('Deserialized message: ')
            // console.dir(message, {depth: null})
            this.push(message)
            callback()
        } catch (e) {
            callback(new SerializerError('SERIALIZE', chunk))
        }
    }
}
