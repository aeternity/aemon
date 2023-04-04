import Constants from './Constants.js'

export default class GetNodeInfoMessage {
    get name() {
        return 'get_node_info'
    }

    get tag() {
        return Constants.MSG_GET_NODE_INFO
    }

    get vsn() {
        return Constants.GET_NODE_INFO_VSN
    }
}
