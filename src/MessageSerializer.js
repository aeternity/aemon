import RLP from 'rlp'
import {FateApiEncoder} from '@aeternity/aepp-calldata'
import Encoder from './Encoder.js'
import Constants from './Messages/Constants.js'
import CloseMessage from './Messages/CloseMessage.js'
import PingMessage from './Messages/PingMessage.js'
import FragmentMessage from './Messages/FragmentMessage.js'
import P2PResponseMessage from './Messages/P2PResponseMessage.js'
import Peer from './Peer.js'

export default class MessageSerializer {
    constructor() {
        this.encoder = new Encoder()
        this.apiEncoder = new FateApiEncoder()
    }

    serialize(message) {
        if (message instanceof FragmentMessage) {
            const buff = Buffer.alloc(6)
            buff.writeUInt16BE(message.tag, 0)
            buff.writeUInt16BE(message.index, 2)
            buff.writeUInt16BE(message.total, 4)

            return [...Buffer.concat([buff, message.data])]
        }

        const encoded = message.encode(this.encoder, this.apiEncoder)
        // console.log('ENCODE MSG:', message)
        // console.dir(encoded, {depth: null})

        return [
            0x0,
            message.tag,
            ...RLP.encode(encoded)
        ]
    }

    deserialize(data) {
        const tag = data[1]
        const rest = data.slice(2)

        // console.log('deserialize:', tag, rest)

        if (tag === Constants.MSG_FRAGMENT) {
            const buff = Buffer.from(rest)
            const index = buff.readUInt16BE(0)
            const total = buff.readUInt16BE(2)
            const data = new Uint8Array(buff.subarray(4))

            // console.log('fragment: ', index, total, data)
            return new FragmentMessage(index, total, data)
        }

        return this.deserializeMessage(tag, rest)
    }

    deserializeMessage(tag, data) {
        // console.log('deserializeMessage:', tag, data)
        if (tag === Constants.MSG_P2P_RESPONSE) {
            const fields = RLP.decode(data)
            // console.log('FIELDS', fields)
            const [vsn, success, messageType, errorReason, message] = RLP.decode(data)
            // console.log('decoded response:', vsn, success, messageType, errorReason, message)
            const isSuccessful = this.encoder.decodeBool(success)
            const messageTag = Number(this.encoder.decodeInt(messageType))

            // console.log('messageTag:', messageTag)
            return new P2PResponseMessage(
                isSuccessful,
                messageTag,
                this.encoder.decodeString(errorReason),
                isSuccessful ? this.deserializeMessage(messageTag, message) : null
            )
        }

        if (tag === Constants.MSG_CLOSE) {
            return new CloseMessage()
        }

        if (tag === Constants.MSG_PING) {
            const fieldsData = RLP.decode(data)
            // console.log('PING fields data', fieldsData)
            const [
                vsn,
                port,
                share,
                genesisHash,
                difficulty,
                bestHash,
                syncAllowed,
                peers
            ] = fieldsData

            const fields = {
                port: Number(this.encoder.decodeInt(port)),
                share: this.encoder.decodeInt(share),
                genesisHash: this.apiEncoder.encode('key_block_hash', this.encoder.decodeBinary(genesisHash)),
                difficulty: this.encoder.decodeInt(difficulty),
                bestHash: this.apiEncoder.encode('key_block_hash', this.encoder.decodeBinary(bestHash)),
                syncAllowed: this.encoder.decodeBool(syncAllowed),
                peers: peers.map((peer) => {
                    return this.deserializePeer(this.encoder, this.apiEncoder, peer)
                }),
            }

            return new PingMessage(fields)
        }

        throw new Error('Unsupported tag: ' + tag)
    }

    deserializePeer(encoder, apiEncoder, buffer) {
        const [host, port, publicKey] = RLP.decode(buffer)

        return new Peer(
            encoder.decodeString(host),
            Number(encoder.decodeInt(port)),
            {pub: apiEncoder.encode('peer_pubkey', encoder.decodeBinary(publicKey))},
        )
    }
}
