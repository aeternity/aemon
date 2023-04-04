import RLP from 'rlp'
import Constants from './Constants.js'

export default class NodeInfoMessage {
    constructor(fields) {
        //@TODO validation ?
        this.fields = fields
    }

    get name() {
        return 'node_info'
    }

    get tag() {
        return Constants.MSG_NODE_INFO
    }

    get vsn() {
        return Constants.NODE_INFO_VSN
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
}
