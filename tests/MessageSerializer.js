import test from 'ava'
import MessageSerializer from '../src/Messages/Serializer/MessageSerializer.js'
import MessageTags from '../src/Messages/MessageTags.js'
import CloseMessage from '../src/Messages/Models/CloseMessage.js'
import PingMessage from '../src/Messages/Models/PingMessage.js'
import ResponseMessage from '../src/Messages/Models/ResponseMessage.js'
import FragmentMessage from '../src/Messages/Models/FragmentMessage.js'
import GetNodeInfoMessage from '../src/Messages/Models/GetNodeInfoMessage.js'
import NodeInfoMessage from '../src/Messages/Models/NodeInfoMessage.js'
import GetGenerationMessage from '../src/Messages/Models/GetGenerationMessage.js'
import TransactionsMessage from '../src/Messages/Models/TransactionsMessage.js'
import Peer from '../src/Peer.js'

const serializer = new MessageSerializer()

const GOSSIPED_PEERS_COUNT = 32n

test('Serialize Close message', t => {
    t.deepEqual(
        serializer.serialize(new CloseMessage()),
        [0, 127, 193, 1]
    )
})

test('Deserialize Close message', t => {
    t.deepEqual(
        serializer.deserialize(new Uint8Array([0, 127, 193, 1])),
        new CloseMessage()
    )
})

test('Serialize Ping message', t => {
    const ping = new PingMessage({
        vsn: 1,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: new Uint8Array([
            108, 21, 218, 110, 191, 175, 2, 120, 254, 175,
            77, 241, 176, 241, 169, 130, 85, 7, 174, 123,
            154, 73, 75, 195, 76, 145, 113, 63, 56, 221, 87, 131
        ]),
        difficulty: 4871850411250n,
        bestHash: new Uint8Array([
            3, 25, 146, 211, 209, 45, 54, 234, 174, 86, 22,
            80, 246, 74, 183, 13, 229, 158, 213, 227, 132,
            27, 219, 9, 87, 121, 159, 221, 200, 163, 60, 147
        ]),
        syncAllowed: false,
        peers: [
            new Peer(
                '127.1.2.3',
                3015,
                {
                    pub: new Uint8Array([
                        86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157,
                        192, 150, 93, 71, 158, 195, 251, 247, 65, 95, 133,
                        186, 215, 55, 239, 203, 194, 165, 95, 97, 56
                    ])
                }
            )
        ]
    })

    t.deepEqual(
        serializer.serialize(ping),
        [0, 1, 248, 128, 1, 130, 11, 199, 32, 160, 108, 21, 218, 110, 191, 175, 2,
            120, 254, 175, 77, 241, 176, 241, 169, 130, 85, 7, 174, 123, 154, 73,
            75, 195, 76, 145, 113, 63, 56, 221, 87, 131, 134, 4, 110, 80, 233, 196,
            242, 160, 3, 25, 146, 211, 209, 45, 54, 234, 174, 86, 22, 80, 246, 74,
            183, 13, 229, 158, 213, 227, 132, 27, 219, 9, 87, 121, 159, 221, 200,
            163, 60, 147, 0, 240, 175, 238, 137, 49, 50, 55, 46, 49, 46, 50, 46, 51,
            130, 11, 199, 160, 86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157,
            192, 150, 93, 71, 158, 195, 251, 247, 65, 95, 133, 186, 215, 55, 239,
            203, 194, 165, 95, 97, 56]
    )
})

test('Deserialize Ping message', t => {
    const ping = new PingMessage({
        vsn: 1,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: new Uint8Array([
            108, 21, 218, 110, 191, 175, 2, 120, 254, 175,
            77, 241, 176, 241, 169, 130, 85, 7, 174, 123,
            154, 73, 75, 195, 76, 145, 113, 63, 56, 221, 87, 131
        ]),
        difficulty: 4871850411250n,
        bestHash: new Uint8Array([
            3, 25, 146, 211, 209, 45, 54, 234, 174, 86, 22,
            80, 246, 74, 183, 13, 229, 158, 213, 227, 132,
            27, 219, 9, 87, 121, 159, 221, 200, 163, 60, 147
        ]),
        syncAllowed: false,
        peers: [
            new Peer(
                '127.1.2.3',
                3015,
                {
                    pub: new Uint8Array([
                        86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157,
                        192, 150, 93, 71, 158, 195, 251, 247, 65, 95, 133,
                        186, 215, 55, 239, 203, 194, 165, 95, 97, 56
                    ])
                }
            )
        ]
    })

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0, 1, 248, 128, 1, 130, 11, 199, 32, 160, 108, 21, 218, 110, 191, 175, 2,
            120, 254, 175, 77, 241, 176, 241, 169, 130, 85, 7, 174, 123, 154, 73,
            75, 195, 76, 145, 113, 63, 56, 221, 87, 131, 134, 4, 110, 80, 233, 196,
            242, 160, 3, 25, 146, 211, 209, 45, 54, 234, 174, 86, 22, 80, 246, 74,
            183, 13, 229, 158, 213, 227, 132, 27, 219, 9, 87, 121, 159, 221, 200,
            163, 60, 147, 0, 240, 175, 238, 137, 49, 50, 55, 46, 49, 46, 50, 46, 51,
            130, 11, 199, 160, 86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157,
            192, 150, 93, 71, 158, 195, 251, 247, 65, 95, 133, 186, 215, 55, 239,
            203, 194, 165, 95, 97, 56
        ])),
        ping
    )
})

test('Serialize Close Response message', t => {
    const response = new ResponseMessage({
        success: true,
        message: new CloseMessage(),
        messageType: MessageTags.MSG_CLOSE,
    })

    t.deepEqual(
        serializer.serialize(response),
        [0, 100, 199, 1, 1, 127, 128, 130, 193, 1]
    )
})

test('Deserialize Close Response message', t => {
    const response = new ResponseMessage({
        success: true,
        message: new CloseMessage(),
        messageType: MessageTags.MSG_CLOSE,
        size: 8
    })

    t.deepEqual(
        serializer.deserialize(new Uint8Array([0, 100, 199, 1, 1, 127, 128, 130, 193, 1])),
        response
    )
})

test('Serialize Ping Response message', t => {
    const message = new PingMessage({
        vsn: 1,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: new Uint8Array([
            108, 21, 218, 110, 191, 175, 2, 120, 254, 175,
            77, 241, 176, 241, 169, 130, 85, 7, 174, 123,
            154, 73, 75, 195, 76, 145, 113, 63, 56, 221, 87, 131
        ]),
        difficulty: 4871850411250n,
        bestHash: new Uint8Array([
            3, 25, 146, 211, 209, 45, 54, 234, 174, 86, 22,
            80, 246, 74, 183, 13, 229, 158, 213, 227, 132,
            27, 219, 9, 87, 121, 159, 221, 200, 163, 60, 147
        ]),
        syncAllowed: false,
        peers: [
            new Peer(
                '127.1.2.3',
                3015,
                {
                    pub: new Uint8Array([
                        86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157,
                        192, 150, 93, 71, 158, 195, 251, 247, 65, 95, 133,
                        186, 215, 55, 239, 203, 194, 165, 95, 97, 56
                    ])
                }
            )
        ]
    })

    const response = new ResponseMessage({success: true, message})

    t.deepEqual(
        serializer.serialize(response),
        [0, 100, 248, 136, 1, 1, 1, 128, 184, 130, 248, 128,
            1, 130, 11, 199, 32, 160, 108, 21, 218, 110, 191, 175,
            2, 120, 254, 175, 77, 241, 176, 241, 169, 130, 85, 7,
            174, 123, 154, 73, 75, 195, 76, 145, 113, 63, 56, 221,
            87, 131, 134, 4, 110, 80, 233, 196, 242, 160, 3, 25,
            146, 211, 209, 45, 54, 234, 174, 86, 22, 80, 246, 74,
            183, 13, 229, 158, 213, 227, 132, 27, 219, 9, 87, 121,
            159, 221, 200, 163, 60, 147, 0, 240, 175, 238, 137, 49,
            50, 55, 46, 49, 46, 50, 46, 51, 130, 11, 199, 160,
            86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157, 192,
            150, 93, 71, 158, 195, 251, 247, 65, 95, 133, 186, 215,
            55, 239, 203, 194, 165, 95, 97, 56]
    )
})

test('Deserialize Ping Response message', t => {
    const message = new PingMessage({
        vsn: 1,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: new Uint8Array([
            108, 21, 218, 110, 191, 175, 2, 120, 254, 175,
            77, 241, 176, 241, 169, 130, 85, 7, 174, 123,
            154, 73, 75, 195, 76, 145, 113, 63, 56, 221, 87, 131
        ]),
        difficulty: 4871850411250n,
        bestHash: new Uint8Array([
            3, 25, 146, 211, 209, 45, 54, 234, 174, 86, 22,
            80, 246, 74, 183, 13, 229, 158, 213, 227, 132,
            27, 219, 9, 87, 121, 159, 221, 200, 163, 60, 147
        ]),
        syncAllowed: false,
        peers: [
            new Peer(
                '127.1.2.3',
                3015,
                {
                    pub: new Uint8Array([
                        86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157,
                        192, 150, 93, 71, 158, 195, 251, 247, 65, 95, 133,
                        186, 215, 55, 239, 203, 194, 165, 95, 97, 56
                    ])
                }
            )
        ]
    })

    const response = new ResponseMessage({
        success: true,
        message,
        messageType: MessageTags.MSG_PING,
        size: 138
    })

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0, 100, 248, 136, 1, 1, 1, 128, 184, 130, 248, 128,
            1, 130, 11, 199, 32, 160, 108, 21, 218, 110, 191, 175,
            2, 120, 254, 175, 77, 241, 176, 241, 169, 130, 85, 7,
            174, 123, 154, 73, 75, 195, 76, 145, 113, 63, 56, 221,
            87, 131, 134, 4, 110, 80, 233, 196, 242, 160, 3, 25,
            146, 211, 209, 45, 54, 234, 174, 86, 22, 80, 246, 74,
            183, 13, 229, 158, 213, 227, 132, 27, 219, 9, 87, 121,
            159, 221, 200, 163, 60, 147, 0, 240, 175, 238, 137, 49,
            50, 55, 46, 49, 46, 50, 46, 51, 130, 11, 199, 160,
            86, 50, 122, 86, 169, 42, 193, 73, 193, 108, 157, 192,
            150, 93, 71, 158, 195, 251, 247, 65, 95, 133, 186, 215,
            55, 239, 203, 194, 165, 95, 97, 56
        ])),
        response
    )
})

test('Serialize GetNodeInfo message', t => {
    t.deepEqual(
        serializer.serialize(new GetNodeInfoMessage()),
        [0, 125, 193, 1]
    )
})

test('Deserialize GetNodeInfo message', t => {
    t.deepEqual(
        serializer.deserialize(new Uint8Array([0, 125, 193, 1])),
        new GetNodeInfoMessage()
    )
})

test('Serialize NodeInfo message', t => {
    const info = new NodeInfoMessage({
        version: '6.5.2',
        revision: 'deadbeef',
        vendor: 'aeternity',
        os: 'linux',
        networkId: 'ae_test',
        verifiedPeers: 5n,
        unverifiedPeers: 27n,
    })

    t.deepEqual(
        serializer.serialize(info),
        [
            0, 126, 234, 1, 133, 54, 46, 53, 46,
            50, 136, 100, 101, 97, 100, 98, 101, 101,
            102, 137, 97, 101, 116, 101, 114, 110, 105,
            116, 121, 133, 108, 105, 110, 117, 120, 135,
            97, 101, 95, 116, 101, 115, 116, 5, 27
        ]
    )
})

test('Deserialize NodeInfo message', t => {
    const info = new NodeInfoMessage({
        vsn: 1,
        version: '6.5.2',
        revision: 'deadbeef',
        vendor: 'aeternity',
        os: 'linux',
        networkId: 'ae_test',
        verifiedPeers: 5n,
        unverifiedPeers: 27n,
    })

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0, 126, 234, 1, 133, 54, 46, 53, 46,
            50, 136, 100, 101, 97, 100, 98, 101, 101,
            102, 137, 97, 101, 116, 101, 114, 110, 105,
            116, 121, 133, 108, 105, 110, 117, 120, 135,
            97, 101, 95, 116, 101, 115, 116, 5, 27
        ])),
        info
    )
})

test('Serialize Fragment message', t => {
    const fragment = new FragmentMessage(3, 5, new Uint8Array([1, 2, 3]))

    t.deepEqual(
        serializer.serialize(fragment),
        [0x00, 0x00, 0x00, 0x03, 0x00, 0x05, 1, 2, 3]
    )
})

test('Deserialize Fragment message', t => {
    const fragment = new FragmentMessage(3, 5, new Uint8Array([1, 2, 3]))

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0x00, 0x00, 0x00, 0x03, 0x00, 0x05, 1, 2, 3
        ])),
        fragment
    )
})

const transactionMessage = new TransactionsMessage({
    vsn: 1,
    transactions: [
        new Uint8Array([
            249, 1, 31, 11, 1, 248, 66, 184, 64, 253, 194, 139,
            240, 16, 159, 222, 79, 103, 182, 9, 225, 200, 99, 135,
            77, 49, 164, 79, 188, 175, 148, 205, 219, 37, 14, 248,
            28, 254, 12, 1, 40, 246, 170, 250, 122, 96, 135, 165,
            115, 71, 69, 115, 35, 69, 63, 127, 253, 52, 183, 115,
            197, 9, 68, 53, 204, 140, 246, 51, 43, 231, 53, 48,
            12, 184, 215, 248, 213, 12, 1, 161, 1, 234, 108, 123,
            148, 81, 247, 177, 44, 175, 199, 65, 254, 34, 194, 169,
            172, 35, 70, 135, 146, 156, 22, 7, 104, 16, 11, 42,
            67, 76, 117, 41, 3, 161, 1, 234, 108, 123, 148, 81,
            247, 177, 44, 175, 199, 65, 254, 34, 194, 169, 172, 35,
            70, 135, 146, 156, 22, 7, 104, 16, 11, 42, 67, 76,
            117, 41, 3, 130, 78, 32, 134, 17, 141, 161, 164, 232,
            0, 131, 11, 179, 59, 131, 137, 190, 62, 184, 123, 55,
            54, 54, 55, 54, 57, 58, 107, 104, 95, 99, 77, 104,
            68, 74, 116, 68, 54, 77, 122, 117, 89, 99, 120, 83,
            100, 102, 114, 86, 56, 102, 121, 75, 49, 87, 51, 117,
            49, 100, 116, 111, 122, 76, 112, 76, 107, 74, 106, 85,
            86, 113, 114, 57, 105, 51, 101, 102, 115, 49, 58, 109,
            104, 95, 120, 77, 97, 98, 51, 77, 80, 101, 109, 76,
            105, 51, 68, 74, 81, 120, 116, 90, 87, 110, 89, 76,
            122, 120, 88, 98, 88, 89, 113, 51, 103, 90, 100, 99,
            110, 65, 78, 74, 85, 56, 105, 97, 86, 77, 72, 112,
            100, 57, 54, 58, 49, 54, 56, 50, 52, 49, 49, 52,
            48, 48
        ])
    ]
})

const transactionMessageBinary = [
    0, 9, 249, 1, 41, 1, 249, 1, 37, 185, 1, 34,
    249, 1, 31, 11, 1, 248, 66, 184, 64, 253, 194, 139,
    240, 16, 159, 222, 79, 103, 182, 9, 225, 200, 99, 135,
    77, 49, 164, 79, 188, 175, 148, 205, 219, 37, 14, 248,
    28, 254, 12, 1, 40, 246, 170, 250, 122, 96, 135, 165,
    115, 71, 69, 115, 35, 69, 63, 127, 253, 52, 183, 115,
    197, 9, 68, 53, 204, 140, 246, 51, 43, 231, 53, 48,
    12, 184, 215, 248, 213, 12, 1, 161, 1, 234, 108, 123,
    148, 81, 247, 177, 44, 175, 199, 65, 254, 34, 194, 169,
    172, 35, 70, 135, 146, 156, 22, 7, 104, 16, 11, 42,
    67, 76, 117, 41, 3, 161, 1, 234, 108, 123, 148, 81,
    247, 177, 44, 175, 199, 65, 254, 34, 194, 169, 172, 35,
    70, 135, 146, 156, 22, 7, 104, 16, 11, 42, 67, 76,
    117, 41, 3, 130, 78, 32, 134, 17, 141, 161, 164, 232,
    0, 131, 11, 179, 59, 131, 137, 190, 62, 184, 123, 55,
    54, 54, 55, 54, 57, 58, 107, 104, 95, 99, 77, 104,
    68, 74, 116, 68, 54, 77, 122, 117, 89, 99, 120, 83,
    100, 102, 114, 86, 56, 102, 121, 75, 49, 87, 51, 117,
    49, 100, 116, 111, 122, 76, 112, 76, 107, 74, 106, 85,
    86, 113, 114, 57, 105, 51, 101, 102, 115, 49, 58, 109,
    104, 95, 120, 77, 97, 98, 51, 77, 80, 101, 109, 76,
    105, 51, 68, 74, 81, 120, 116, 90, 87, 110, 89, 76,
    122, 120, 88, 98, 88, 89, 113, 51, 103, 90, 100, 99,
    110, 65, 78, 74, 85, 56, 105, 97, 86, 77, 72, 112,
    100, 57, 54, 58, 49, 54, 56, 50, 52, 49, 49, 52,
    48, 48
]

test('Serialize Transactions message', t => {
    t.deepEqual(
        serializer.serialize(transactionMessage),
        transactionMessageBinary
    )
})

test('Deserialize Transactions message', t => {
    t.deepEqual(
        serializer.deserialize(new Uint8Array(transactionMessageBinary)),
        transactionMessage
    )
})

test('Serialize GetGeneration message', t => {
    const message = new GetGenerationMessage({
        hash: new Uint8Array([
            112, 97, 254, 85, 187, 122, 167, 155, 35, 70, 15,
            210, 159, 255, 80, 30, 164, 185, 140, 18, 72, 84,
            141, 0, 120, 4, 196, 116, 72, 243, 64, 2
        ]),
        forward: false,
    })

    t.deepEqual(
        serializer.serialize(message),
        [
            0, 8, 227, 1, 160, 112, 97, 254, 85,
            187, 122, 167, 155, 35, 70, 15, 210, 159,
            255, 80, 30, 164, 185, 140, 18, 72, 84,
            141, 0, 120, 4, 196, 116, 72, 243, 64,
            2, 0
        ]
    )
})

test('Deserialize GetGeneration message', t => {
    const message = new GetGenerationMessage({
        vsn: 1,
        hash: new Uint8Array([
            112, 97, 254, 85, 187, 122, 167, 155, 35, 70, 15,
            210, 159, 255, 80, 30, 164, 185, 140, 18, 72, 84,
            141, 0, 120, 4, 196, 116, 72, 243, 64, 2
        ]),
        forward: false,
    })

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0, 8, 227, 1, 160, 112, 97, 254, 85,
            187, 122, 167, 155, 35, 70, 15, 210, 159,
            255, 80, 30, 164, 185, 140, 18, 72, 84,
            141, 0, 120, 4, 196, 116, 72, 243, 64,
            2, 0
        ])),
        message
    )
})
