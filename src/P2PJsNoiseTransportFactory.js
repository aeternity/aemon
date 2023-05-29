import stream from 'stream'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import NoiseWasmSession from './NoiseWasmSession.js'
import EncodeFrameTransform from './Transforms/EncodeFrameTransform.js'
import DecodeFrameTransform from './Transforms/DecodeFrameTransform.js'
import NoiseEncryptTransform from './Transforms/NoiseEncryptTransform.js'
import NoiseDecryptTransform from './Transforms/NoiseDecryptTransform.js'
import MessageSerializeTransform from './Transforms/MessageSerializeTransform.js'
import MessageDeserializeTransform from './Transforms/MessageDeserializeTransform.js'

// var peer = require('noise-peer')
import peer from 'noise-peer'

const P2P_PROTOCOL_VSN = 1n
const ROLES = {
    'initiator': NoiseWasmSession.ROLE_INITIATOR,
    'responder': NoiseWasmSession.ROLE_RESPONDER,
}

export default class P2PJsNoiseTransportFactory {
    constructor(network, role, localKeypair) {
        this.network = network
        this.role = role
        this.localKeypair = localKeypair

        this.apiEncoder = new FateApiEncoder()
    }

    create(socket, remotePeerKey) {
        // const noiseRole = ROLES[this.role]
        const prologue = this.#getNoisePrologue()
        const localKeypair = {
            publicKey: this.apiEncoder.decode(this.localKeypair.pub),
            secretKey: this.apiEncoder.decode(this.localKeypair.prv),
        }

        var noiseOpts = {
            pattern: 'XK',
            staticKeyPair: localKeypair,
            prologue
        }

        if (remotePeerKey) {
            noiseOpts.remoteStaticKey = this.apiEncoder.decode(remotePeerKey)
        }

        return this.#createStream(socket, noiseOpts)
    }

    #createStream(socket, noiseOpts) {
        // const noiseEncrypt = new NoiseEncryptTransform(noiseSession)
        // const noiseDecrypt = new NoiseDecryptTransform(noiseSession)

        const messageSerializer = new MessageSerializeTransform()
        const messageDeserializer = new MessageDeserializeTransform()

        const frameEncoder = new EncodeFrameTransform()
        const frameDecoder = new DecodeFrameTransform()

        const duplex = stream.Duplex.from({
            writable: messageSerializer,
            readable: messageDeserializer
        })

        console.log('noiseOpts', noiseOpts)

        const sec = peer(socket, this.role === 'initiator', noiseOpts)

        // // don't exit on decryption error but post it up
        // noiseDecrypt.on('error', data => duplex.emit('error', data))

        // // manually handle handshake writes
        // noiseDecrypt.on('handshakeData', data => frameEncoder.write(data))
        // //relay to the duplex stream
        // noiseDecrypt.on('handshake', () => {
        //     // console.log('handshake with session remote key:', noiseSession.remotePublicKey)
        //     duplex.emit('handshake', noiseSession.remotePublicKey)
        // })

        messageSerializer
            // .pipe(noiseEncrypt)
            // .pipe(frameEncoder)
            .pipe(sec)
            // .pipe(frameDecoder)
            // .pipe(noiseDecrypt)
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
