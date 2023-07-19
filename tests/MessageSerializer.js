import test from 'ava'
import MessageSerializer from '../src/MessageSerializer.js'
import CloseMessage from '../src/Messages/CloseMessage.js'
import PingMessage from '../src/Messages/PingMessage.js'
import ResponseMessage from '../src/Messages/ResponseMessage.js'
import FragmentMessage from '../src/Messages/FragmentMessage.js'
import NodeInfoMessage from '../src/Messages/NodeInfoMessage.js'
import GetGenerationMessage from '../src/Messages/GetGenerationMessage.js'
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
        vsn: 1n,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z',
        difficulty: 4871850411250n,
        bestHash: 'kh_2NBbbtk1fqAxrSQcqHRZbEef32fGaR3p7z2DgcSfk1h9sAKUz',
        syncAllowed: false,
        peers: [
            new Peer('127.1.2.3', 3015, {pub: 'pp_exntnJW9Xv7Yi779esBghuNJ7TG2DXU8BXdjRiNSgrqQw2JZT'})
        ]
    })

    t.deepEqual(
        serializer.serialize(ping),
        [0,1,248,128,1,130,11,199,32,160,108,21,218,110,191,175,2,
          120,254,175,77,241,176,241,169,130,85,7,174,123,154,73,
          75,195,76,145,113,63,56,221,87,131,134,4,110,80,233,196,
          242,160,3,25,146,211,209,45,54,234,174,86,22,80,246,74,
          183,13,229,158,213,227,132,27,219,9,87,121,159,221,200,
          163,60,147,0,240,175,238,137,49,50,55,46,49,46,50,46,51,
          130,11,199,160,86,50,122,86,169,42,193,73,193,108,157,
          192,150,93,71,158,195,251,247,65,95,133,186,215,55,239,
          203,194,165,95,97,56]
    )
})

test('Deserialize Ping message', t => {
    const ping = new PingMessage({
        vsn: 1n,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z',
        difficulty: 4871850411250n,
        bestHash: 'kh_2NBbbtk1fqAxrSQcqHRZbEef32fGaR3p7z2DgcSfk1h9sAKUz',
        syncAllowed: false,
        peers: [
            new Peer('127.1.2.3', 3015n, {pub: 'pp_exntnJW9Xv7Yi779esBghuNJ7TG2DXU8BXdjRiNSgrqQw2JZT'})
        ]
    })

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0,1,248,128,1,130,11,199,32,160,108,21,218,110,191,175,2,
          120,254,175,77,241,176,241,169,130,85,7,174,123,154,73,
          75,195,76,145,113,63,56,221,87,131,134,4,110,80,233,196,
          242,160,3,25,146,211,209,45,54,234,174,86,22,80,246,74,
          183,13,229,158,213,227,132,27,219,9,87,121,159,221,200,
          163,60,147,0,240,175,238,137,49,50,55,46,49,46,50,46,51,
          130,11,199,160,86,50,122,86,169,42,193,73,193,108,157,
          192,150,93,71,158,195,251,247,65,95,133,186,215,55,239,
          203,194,165,95,97,56
        ])),
        ping
    )
})

test('Serialize Response message', t => {
    const ping = new PingMessage({
        vsn: 1n,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z',
        difficulty: 4871850411250n,
        bestHash: 'kh_2NBbbtk1fqAxrSQcqHRZbEef32fGaR3p7z2DgcSfk1h9sAKUz',
        syncAllowed: false,
        peers: [
            new Peer('127.1.2.3', 3015n, {pub: 'pp_exntnJW9Xv7Yi779esBghuNJ7TG2DXU8BXdjRiNSgrqQw2JZT'})
        ]
    })
    const response = new ResponseMessage(true, ping.tag, '', ping)

    t.deepEqual(
        serializer.serialize(response),
        [0,100,248,136,1,1,1,128,184,130,248,128,
            1,130,11,199,32,160,108,21,218,110,191,175,
            2,120,254,175,77,241,176,241,169,130,85,7,
          174,123,154,73,75,195,76,145,113,63,56,221,
           87,131,134,4,110,80,233,196,242,160,3,25,
          146,211,209,45,54,234,174,86,22,80,246,74,
          183,13,229,158,213,227,132,27,219,9,87,121,
          159,221,200,163,60,147,0,240,175,238,137,49,
           50,55,46,49,46,50,46,51,130,11,199,160,
           86,50,122,86,169,42,193,73,193,108,157,192,
          150,93,71,158,195,251,247,65,95,133,186,215,
           55,239,203,194,165,95,97,56]
    )
})

test('Deserialize Response message', t => {
    const ping = new PingMessage({
        vsn: 1n,
        port: 3015n,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z',
        difficulty: 4871850411250n,
        bestHash: 'kh_2NBbbtk1fqAxrSQcqHRZbEef32fGaR3p7z2DgcSfk1h9sAKUz',
        syncAllowed: false,
        peers: [
            new Peer('127.1.2.3', 3015n, {pub: 'pp_exntnJW9Xv7Yi779esBghuNJ7TG2DXU8BXdjRiNSgrqQw2JZT'})
        ]
    })
    const response = new ResponseMessage(true, ping.tag, '', ping, 138)

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0,100,248,136,1,1,1,128,184,130,248,128,
            1,130,11,199,32,160,108,21,218,110,191,175,
            2,120,254,175,77,241,176,241,169,130,85,7,
          174,123,154,73,75,195,76,145,113,63,56,221,
           87,131,134,4,110,80,233,196,242,160,3,25,
          146,211,209,45,54,234,174,86,22,80,246,74,
          183,13,229,158,213,227,132,27,219,9,87,121,
          159,221,200,163,60,147,0,240,175,238,137,49,
           50,55,46,49,46,50,46,51,130,11,199,160,
           86,50,122,86,169,42,193,73,193,108,157,192,
          150,93,71,158,195,251,247,65,95,133,186,215,
           55,239,203,194,165,95,97,56
        ])),
        response
    )
})

test('Serialize Info message', t => {
    const info = new NodeInfoMessage({
        version: '6.5.2',
        revision: 'deadbeef',
        vendor: 'aeternity',
        os: 'linux',
        networkId: 'ae_test',
        verifiedPeers: 5,
        unverifiedPeers: 27,
    })

    t.deepEqual(
        serializer.serialize(info),
        [
            0, 126, 234,   1, 133,  54,  46,  53,  46,
           50, 136, 100, 101,  97, 100,  98, 101, 101,
          102, 137,  97, 101, 116, 101, 114, 110, 105,
          116, 121, 133, 108, 105, 110, 117, 120, 135,
           97, 101,  95, 116, 101, 115, 116,   5,  27
        ]
    )
})

test('Deserialize Info message', t => {
    const info = new NodeInfoMessage({
        vsn: 1n,
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
            0, 126, 234,   1, 133,  54,  46,  53,  46,
           50, 136, 100, 101,  97, 100,  98, 101, 101,
          102, 137,  97, 101, 116, 101, 114, 110, 105,
          116, 121, 133, 108, 105, 110, 117, 120, 135,
           97, 101,  95, 116, 101, 115, 116,   5,  27
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


test('Serialize GetGeneration message', t => {
    const message = new GetGenerationMessage({
        hash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
        forward: false,
    })

    t.deepEqual(
        serializer.serialize(message),
        [
            0,   8, 227,   1, 160, 112, 97, 254,  85,
          187, 122, 167, 155,  35,  70, 15, 210, 159,
          255,  80,  30, 164, 185, 140, 18,  72,  84,
          141,   0, 120,   4, 196, 116, 72, 243,  64,
            2,   0
        ]
    )
})

test('Deserialize GetGeneration message', t => {
    const message = new GetGenerationMessage({
        vsn: 1n,
        hash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
        forward: false,
    })

    t.deepEqual(
        serializer.deserialize(new Uint8Array([
            0,   8, 227,   1, 160, 112, 97, 254,  85,
          187, 122, 167, 155,  35,  70, 15, 210, 159,
          255,  80,  30, 164, 185, 140, 18,  72,  84,
          141,   0, 120,   4, 196, 116, 72, 243,  64,
            2,   0
        ])),
        message
    )
})
