import RLP from 'rlp'
import Constants from './Constants.js'

export default class NodeInfoMessage {
    get name() {
        return 'node_info'
    }

    static get TAG() {
        return Constants.MSG_NODE_INFO
    }

    static get VERSION() {
        return Constants.NODE_INFO_VSN
    }

    constructor(fields) {
        //@TODO validation ?
        this.fields = fields
    }

    get tag() {
        return Constants.MSG_NODE_INFO
    }

    get version() {
        return this.fields.version
    }

    get revision() {
        return this.fields.revision
    }

    get vendor() {
        return this.fields.vendor
    }

    get os() {
        return this.fields.os
    }

    get networkId() {
        return this.fields.networkId
    }

    get verifiedPeers() {
        return this.fields.verifiedPeers
    }

    get unverifiedPeers() {
        return this.fields.unverifiedPeers
    }

    encode(encoder, apiEncoder) {
        return [
            encoder.encodeInt(NodeInfoMessage.VERSION),
            encoder.encodeString(this.fields.version),
            encoder.encodeString(this.fields.revision),
            encoder.encodeString(this.fields.vendor),
            encoder.encodeString(this.fields.os),
            encoder.encodeString(this.fields.networkId),
            encoder.encodeInt(this.fields.verifiedPeers),
            encoder.encodeInt(this.fields.unverifiedPeers),
        ]
    }
}
