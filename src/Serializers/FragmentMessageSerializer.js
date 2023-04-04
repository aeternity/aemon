import RLP from 'rlp'
import Constants from '../Messages/Constants.js'
import FragmentMessage from '../Messages/FragmentMessage.js'

export default class FragmentMessageSerializer {
    static get TAG() {
        return Constants.MSG_FRAGMENT
    }

    constructor() {
    }

    serialize(message) {
        const buff = Buffer.alloc(6)
        buff.writeUInt16BE(message.tag, 0)
        buff.writeUInt16BE(message.index, 2)
        buff.writeUInt16BE(message.total, 4)

        return [...Buffer.concat([buff, message.data])]
    }

    deserialize(data) {
        const buff = Buffer.from(data)
        const index = buff.readUInt16BE(0)
        const total = buff.readUInt16BE(2)
        const fragmentData = new Uint8Array(buff.subarray(4))

        // console.log('fragment: ', index, total, fragmentData)
        return new FragmentMessage(index, total, fragmentData)
    }
}
