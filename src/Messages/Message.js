import Constants from './Constants.js'

export default class Message {
    constructor(name) {
        const NAME = name.toUpperCase()

        this.name = name
        this.tag = Constants['MSG_' + NAME]
        this.vsn = Constants[NAME + '_VSN']
    }
}
