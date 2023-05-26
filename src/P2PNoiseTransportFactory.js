import stream from 'stream'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import NoiseWasmSession from './NoiseWasmSession.js'
import EncodeFrameTransform from './Transforms/EncodeFrameTransform.js'
import DecodeFrameTransform from './Transforms/DecodeFrameTransform.js'
import NoiseEncryptTransform from './Transforms/NoiseEncryptTransform.js'
import NoiseDecryptTransform from './Transforms/NoiseDecryptTransform.js'
import MessageSerializeTransform from './Transforms/MessageSerializeTransform.js'
import MessageDeserializeTransform from './Transforms/MessageDeserializeTransform.js'

const P2P_PROTOCOL_VSN = 1n
const ROLES = {
    'initiator': NoiseWasmSession.ROLE_INITIATOR,
    'responder': NoiseWasmSession.ROLE_RESPONDER,
}

export default class P2PNoiseTransportFactory {
    constructor(network, role, localPrivateKey) {
        this.network = network
        this.role = role
        this.localPrivateKey = localPrivateKey

        this.apiEncoder = new FateApiEncoder()
    }

    create(socket, remotePeerKey) {
        const noiseRole = ROLES[this.role]
        const prologue = this.#getNoisePrologue()
        const localKey = this.apiEncoder.decode(this.localPrivateKey)

        let remoteKey = null
        if (remotePeerKey) {
            remoteKey = this.apiEncoder.decode(remotePeerKey)
        }

        const noiseSession = new NoiseWasmSession(noiseRole, prologue, localKey, remoteKey)
        const transport = this.#createStream(socket, noiseSession)

        return transport
    }

    #createStream(socket, noiseSession) {
        const noiseEncrypt = new NoiseEncryptTransform(noiseSession)
        const noiseDecrypt = new NoiseDecryptTransform(noiseSession)

        const messageSerializer = new MessageSerializeTransform()
        const messageDeserializer = new MessageDeserializeTransform()

        const frameEncoder = new EncodeFrameTransform()
        const frameDecoder = new DecodeFrameTransform()

        const duplex = stream.Duplex.from({
            writable: messageSerializer,
            readable: messageDeserializer
        })

        // don't exit on decryption error but post it up
        noiseDecrypt.on('error', data => duplex.emit('error', data))

        // manually handle handshake writes
        noiseDecrypt.on('handshakeData', data => frameEncoder.write(data))
        //relay to the duplex stream
        noiseDecrypt.on('handshake', () => {
            // console.log('handshake with session remote key:', noiseSession.remotePublicKey)
            duplex.emit('handshake', noiseSession.remotePublicKey)
        })

        messageSerializer
            .pipe(noiseEncrypt)
            .pipe(frameEncoder)
            .pipe(socket)
            .pipe(frameDecoder)
            .pipe(noiseDecrypt)
            .pipe(messageDeserializer)

        return duplex
    }

    #getNoisePrologue(network) {
        const version = Buffer.alloc(8)
        version.writeBigInt64BE(P2P_PROTOCOL_VSN, 0)

        const genesis = this.apiEncoder.decode(this.network.genesisHash)
        const networkId = Buffer.from(this.network.networkId, 'utf-8')

        // console.log('Noise prologue:', version, genesis, networkId)

        return Buffer.concat([version, genesis, networkId])
    }
}
