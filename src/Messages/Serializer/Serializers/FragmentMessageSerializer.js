import RLP from 'rlp'
import MessageTags from '../../MessageTags.js'
import FragmentMessage from '../../Models/FragmentMessage.js'

export default class FragmentMessageSerializer {
    static get TAG() {
        return MessageTags.MSG_FRAGMENT
    }

    constructor() {
    }

    serialize(message) {
        const dataView = new DataView(new ArrayBuffer(4))
        dataView.setUint16(0, message.index)
        dataView.setUint16(2, message.total)

        const fields = new Uint8Array(dataView.buffer)

        return new Uint8Array([...fields, ...message.data])
    }

    deserialize(data) {
        const dataView = new DataView(data.buffer)
        const index = dataView.getUint16(0)
        const total = dataView.getUint16(2)
        const fragmentData = data.slice(4)

        return new FragmentMessage(index, total, fragmentData)
    }
}
