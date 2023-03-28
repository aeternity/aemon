import test from 'ava'
import MessageSerializer from '../src/MessageSerializer.js'
import CloseMessage from '../src/Messages/CloseMessage.js'
import PingMessage from '../src/Messages/PingMessage.js'
import P2PResponseMessage from '../src/Messages/P2PResponseMessage.js'
import FragmentMessage from '../src/Messages/FragmentMessage.js'
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
        port: 3015,
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
        port: 3015,
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
        port: 3015,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z',
        difficulty: 4871850411250n,
        bestHash: 'kh_2NBbbtk1fqAxrSQcqHRZbEef32fGaR3p7z2DgcSfk1h9sAKUz',
        syncAllowed: false,
        peers: [
            new Peer('127.1.2.3', 3015, {pub: 'pp_exntnJW9Xv7Yi779esBghuNJ7TG2DXU8BXdjRiNSgrqQw2JZT'})
        ]
    })
    const response = new P2PResponseMessage(true, ping.tag, '', ping)

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
        port: 3015,
        share: GOSSIPED_PEERS_COUNT,
        genesisHash: 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z',
        difficulty: 4871850411250n,
        bestHash: 'kh_2NBbbtk1fqAxrSQcqHRZbEef32fGaR3p7z2DgcSfk1h9sAKUz',
        syncAllowed: false,
        peers: [
            new Peer('127.1.2.3', 3015, {pub: 'pp_exntnJW9Xv7Yi779esBghuNJ7TG2DXU8BXdjRiNSgrqQw2JZT'})
        ]
    })
    const response = new P2PResponseMessage(true, ping.tag, '', ping)

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
