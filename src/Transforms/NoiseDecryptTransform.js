import stream from 'stream'

export default class NoiseDecryptTransform extends stream.Transform {
    #session = null

    constructor(session, options) {
        super({
            objectMode: true,
        })

        this.#session = session
    }

    _transform(chunk, encoding, callback) {
        if (this.#session.isHandshaking()) {
            this.handshake(chunk)
        } else {
            this.push(this.#session.decrypt(chunk))
        }

        callback()
    }

    handshake(data) {
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
