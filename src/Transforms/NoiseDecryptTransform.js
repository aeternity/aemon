import stream from 'stream'
import HandshakeError from '../HandshakeError.js'

export default class NoiseDecryptTransform extends stream.Transform {
    #session = null

    constructor(session, options) {
        super({
            objectMode: true,
        })

        this.#session = session
    }

    _transform(chunk, encoding, callback) {
        try {
            if (this.#session.isHandshaking()) {
                this.handshake(chunk)
            } else {
                this.push(this.#session.decrypt(chunk))
            }

            callback()
        } catch (e) {
            callback(new HandshakeError('Handshake failed'))
        }
    }

    handshake(data, callback) {
        const handshakeData = this.#session.handshake(data)
        if (handshakeData !== null) {
            this.emit('handshakeData', handshakeData)
        }

        // done handshaking?
        if (!this.#session.isHandshaking()) {
            this.emit('handshake')
        }
    }
}
