import Message from './Message.js'

export default class PingMessage extends Message {
    constructor(fields) {
        super('ping')

        // @TODO validation ?
        Object.assign(this, fields)
        this.port = Number(this.port)
    }

    toJSON() {
        const json = { ...this}
        json.peersCount = this.peers.length
        delete json.peers

        return json
    }
}
