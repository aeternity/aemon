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
            this.encoder.encodeField('int', message.vsn),
            this.encoder.encodeField('string', message.version),
            this.encoder.encodeField('string', message.revision),
            this.encoder.encodeField('string', message.vendor),
            this.encoder.encodeField('string', message.os),
            this.encoder.encodeField('string', message.networkId),
            this.encoder.encodeField('int', message.verifiedPeers),
            this.encoder.encodeField('int', message.unverifiedPeers),
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
            version: this.encoder.decodeField('string', version),
            revision: this.encoder.decodeField('string', revision),
            vendor: this.encoder.decodeField('string', vendor),
            os: this.encoder.decodeField('string', os),
            networkId: this.encoder.decodeField('string', networkId),
            verifiedPeers: Number(this.encoder.decodeField('int', verifiedPeers)),
            unverifiedPeers: Number(this.encoder.decodeField('int', unverifiedPeers)),
        }

        return new NodeInfoMessage(fields)
    }
}
