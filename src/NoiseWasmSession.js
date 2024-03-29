import createNoise from 'noise-c.wasm'

const PROTOCOL_NAME = 'Noise_XK_25519_ChaChaPoly_BLAKE2b'
const EMPTY = new Uint8Array()

const createNoisePromise = () => {
    return new Promise(resolve => {
        createNoise((noise) => resolve(noise))
    })
}

const noise = await createNoisePromise()

export default class NoiseWasmSession {
    static ROLE_INITIATOR = Symbol('INITIATOR')

    static ROLE_RESPONDER = Symbol('RESPONDER')

    #handshake = null

    #send = null

    #receive = null

    isInitiator = false

    /**
     * Must be called after object creation and after switch to a fallback handshake.
     *
     * In case of fallback handshake it is not required to specify values
     * that are the same as in previous Initialize() call, those will be used by default
     *
     * @param {ROLE_INITIATOR|ROLE_RESPONDER} role          Noise role
     * @param {null|Uint8Array}               prologue      Prologue value
     * @param {null|Uint8Array}               localKey      Local static private key
     * @param {null|Uint8Array}               remoteKey     Remote static public key
     */
    constructor(role, prologue, localKey, remoteKey) {
        this.isInitiator = (role === NoiseWasmSession.ROLE_INITIATOR)
        this.#handshake = noise.HandshakeState(PROTOCOL_NAME, this.#noiseRole(role))
        this.#handshake.Initialize(prologue, localKey, remoteKey)
    }

    static createKeyPair() {
        return noise.CreateKeyPair(noise.constants.NOISE_DH_CURVE25519)
    }

    get remotePublicKey() {
        return this.#handshake.GetRemotePublicKey()
    }

    isHandshaking() {
        return !!Object.keys(this.#handshake).length
    }

    handshake(data) {
        if (this.#handshake.GetAction() === noise.constants.NOISE_ACTION_SPLIT) {
            return this.#handshakeSplit()
        }

        if (this.#handshake.GetAction() === noise.constants.NOISE_ACTION_READ_MESSAGE) {
            return this.#handshakeRead(data)
        }

        if (this.#handshake.GetAction() === noise.constants.NOISE_ACTION_WRITE_MESSAGE) {
            return this.#handshakeWrite()
        }

        throw new Error('Unknown action handler for: ', this.#handshake.GetAction())
    }

    encrypt(data) {
        if (this.isHandshaking()) {
            throw new Error('Cannot encrypt during handshake')
        }

        return this.#send.EncryptWithAd(EMPTY, data)
    }

    decrypt(data) {
        if (this.isHandshaking()) {
            throw new Error('Cannot decrypt during handshake')
        }

        return this.#receive.DecryptWithAd(EMPTY, data)
    }

    #handshakeRead(data) {
        this.#handshake.ReadMessage(data)

        if (this.#handshake.GetAction() === noise.constants.NOISE_ACTION_WRITE_MESSAGE) {
            return this.#handshakeWrite()
        }

        if (this.#handshake.GetAction() === noise.constants.NOISE_ACTION_SPLIT) {
            return this.#handshakeSplit()
        }

        return null
    }

    #handshakeWrite() {
        const buff = this.#handshake.WriteMessage()

        // next state: read or split
        // however reads are triggered by socket events
        // if (this.#handshake.GetAction() === noise.constants.NOISE_ACTION_READ_MESSAGE) {
        // }

        if (this.#handshake.GetAction() === noise.constants.NOISE_ACTION_SPLIT) {
            this.#handshakeSplit()
        }

        return buff
    }

    #handshakeSplit() {
        const [send, receive] = this.#handshake.Split()
        this.#send = send
        this.#receive = receive

        return null
    }

    #noiseRole(role) {
        if (role === NoiseWasmSession.ROLE_INITIATOR) {
            return noise.constants.NOISE_ROLE_INITIATOR
        }

        if (role === NoiseWasmSession.ROLE_RESPONDER) {
            return noise.constants.NOISE_ROLE_RESPONDER
        }

        throw new Error('Unknown role: ' + role)
    }

    free() {
        if (this.isHandshaking()) {
            this.#handshake.free()
            return
        }

        this.#send.free()
        this.#receive.free()
    }
}
