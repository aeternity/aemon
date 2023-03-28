import stream from 'stream'

export default class NoiseEncryptTransform extends stream.Transform {
    #session = null

    constructor(session, options) {
        super({
            objectMode: true,
        })

        this.#session = session

        if (session.isInitiator) {
            this.handshake()
        }
    }

    _transform(chunk, encoding, callback) {
        if (this.#session.isHandshaking()) {
            this.handshake(chunk)
        } else {
            this.push(this.#session.encrypt(chunk))
        }

        callback()
    }

    handshake(data) {
        const handshakeData = this.#session.handshake(data)
        if (handshakeData !== null) {
            // console.log('[NoiseConnection] TX:', Buffer.from(handshakeData))
            this.push(handshakeData)
        }
    }
}
