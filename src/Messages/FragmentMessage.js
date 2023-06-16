import Message from './Message.js'

export default class FragmentMessage extends Message {
    constructor(index, total, data) {
        super('fragment')

        if (data.length > (65536 - 6)) {
            throw new Error('Data size must be maximum of 65530 bytes')
        }

        if (index > 65535) {
            throw new Error('Index must be maximum of 65535')
        }

        if (total > 65535) {
            throw new Error('Total must be maximum of 65535')
        }

        this.index = index
        this.total = total
        this.data = data
    }
}
