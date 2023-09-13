import MessageTags from '../MessageTags.js'

export default class Message {
    constructor(name) {
        const NAME = name.toUpperCase()

        this.name = name
        this.tag = MessageTags['MSG_' + NAME]
        this.vsn = MessageTags[NAME + '_VSN']
    }
}
