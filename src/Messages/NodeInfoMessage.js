import Message from './Message.js'

export default class NodeInfoMessage extends Message {
    constructor(fields) {
        super('node_info')

        //@TODO validation ?
        this.fields = fields
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
        return Number(this.fields.verifiedPeers)
    }

    get unverifiedPeers() {
        return Number(this.fields.unverifiedPeers)
    }
}
