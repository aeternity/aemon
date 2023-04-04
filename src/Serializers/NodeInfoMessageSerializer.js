import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import NodeInfoMessage from '../Messages/NodeInfoMessage.js'

export default class NodeInfoMessageSerializer {
    static get TAG() {
        return Constants.MSG_NODE_INFO
    }

    constructor(encoder) {
        this.encoder = encoder
    }

    serialize(message) {
        return [
            this.encoder.encodeInt(message.vsn),
            this.encoder.encodeString(message.version),
            this.encoder.encodeString(message.revision),
            this.encoder.encodeString(message.vendor),
            this.encoder.encodeString(message.os),
            this.encoder.encodeString(message.networkId),
            this.encoder.encodeInt(message.verifiedPeers),
            this.encoder.encodeInt(message.unverifiedPeers),
        ]
    }

    deserialize(data) {
        const fieldsData = RLP.decode(data)
        // console.log('INFO fields data', fieldsData)
        const [
            vsn,
            version,
            revision,
            vendor,
            os,
            networkId,
            verifiedPeers,
            unverifiedPeers
        ] = fieldsData

        const fields = {
            version: this.encoder.decodeString(version),
            revision: this.encoder.decodeString(revision),
            vendor: this.encoder.decodeString(vendor),
            os: this.encoder.decodeString(os),
            networkId: this.encoder.decodeString(networkId),
            verifiedPeers: Number(this.encoder.decodeInt(verifiedPeers)),
            unverifiedPeers: Number(this.encoder.decodeInt(unverifiedPeers)),

        }

        return new NodeInfoMessage(fields)
    }
}
