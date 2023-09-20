import test from 'ava'
import MessageEncoder from '../src/Messages/Encoder/MessageEncoder.js'
import CloseMessage from '../src/Messages/Models/CloseMessage.js'
import PingMessage from '../src/Messages/Models/PingMessage.js'
import ResponseMessage from '../src/Messages/Models/ResponseMessage.js'
import FragmentMessage from '../src/Messages/Models/FragmentMessage.js'
import NodeInfoMessage from '../src/Messages/Models/NodeInfoMessage.js'
import GetGenerationMessage from '../src/Messages/Models/GetGenerationMessage.js'
import Peer from '../src/Peer.js'
import ChainObject from '../src/ChainObjects/ChainObject.js'
import TransactionsMessage from '../src/Messages/Models/TransactionsMessage.js'
import MicroBlockMessage from '../src/Messages/Models/MicroBlockMessage.js'
import KeyBlockMessage from '../src/Messages/Models/KeyBlockMessage.js'
import GenerationMessage from '../src/Messages/Models/GenerationMessage.js'

const encoder = new MessageEncoder()

const GOSSIPED_PEERS_COUNT = 32n

test('Encode Close message', t => {
    t.deepEqual(
        encoder.encode(new CloseMessage()),
        //0, 127 is the tag, 2 bytes
        //193 is RLP list with 1 element
        //1 is the element value, int 1
        [0, 127, 193, 1]
    )
})

test('Decode Close message', t => {
    t.deepEqual(
        encoder.decode(new Uint8Array([0, 127, 193, 1])),
        new CloseMessage()
    )
})

test('Encode Ping message', t => {
    const ping = new PingMessage({
        vsn: 1,
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
        encoder.encode(ping),
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

test('Decode Ping message', t => {
    const ping = new PingMessage({
        vsn: 1,
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
        encoder.decode(new Uint8Array([
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

test('Encode Close Response message', t => {
    const message = new CloseMessage()
    const response = new ResponseMessage({success: true, message})

    t.deepEqual(
        encoder.encode(response),
        [0, 100, 199,1,1,127,128,130,193,1]
    )
})

test('Decode Close Response message', t => {
    const message = new CloseMessage()
    const response = new ResponseMessage({success: true, message, size: 8})

    t.deepEqual(
        encoder.decode(new Uint8Array([0, 100, 199,1,1,127,128,130,193,1])),
        response
    )
})

test('Encode Ping Response message', t => {
    const message = new PingMessage({
        vsn: 1,
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
    const response = new ResponseMessage({success: true, message})

    t.deepEqual(
        encoder.encode(response),
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

test('Decode Response message', t => {
    const message = new PingMessage({
        vsn: 1,
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
    const response = new ResponseMessage({
        success: true,
        message,
        size: 138
    })

    t.deepEqual(
        encoder.decode(new Uint8Array([
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

test('Encode Info message', t => {
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
        encoder.encode(info),
        [
            0, 126, 234,   1, 133,  54,  46,  53,  46,
           50, 136, 100, 101,  97, 100,  98, 101, 101,
          102, 137,  97, 101, 116, 101, 114, 110, 105,
          116, 121, 133, 108, 105, 110, 117, 120, 135,
           97, 101,  95, 116, 101, 115, 116,   5,  27
        ]
    )
})

test('Decode Info message', t => {
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
        encoder.decode(new Uint8Array([
            0, 126, 234,   1, 133,  54,  46,  53,  46,
           50, 136, 100, 101,  97, 100,  98, 101, 101,
          102, 137,  97, 101, 116, 101, 114, 110, 105,
          116, 121, 133, 108, 105, 110, 117, 120, 135,
           97, 101,  95, 116, 101, 115, 116,   5,  27
        ])),
        info
    )
})

test('Encode Fragment message', t => {
    const fragment = new FragmentMessage(3, 5, new Uint8Array([1, 2, 3]))

    t.deepEqual(
        encoder.encode(fragment),
        [0x00, 0x00, 0x00, 0x03, 0x00, 0x05, 1, 2, 3]
    )
})

test('Decode Fragment message', t => {
    const fragment = new FragmentMessage(3, 5, new Uint8Array([1, 2, 3]))

    t.deepEqual(
        encoder.decode(new Uint8Array([
            0x00, 0x00, 0x00, 0x03, 0x00, 0x05, 1, 2, 3
        ])),
        fragment
    )
})

test('Encode GetGeneration message', t => {
    const message = new GetGenerationMessage({
        hash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
        forward: false,
    })

    t.deepEqual(
        encoder.encode(message),
        [
            0,   8, 227,   1, 160, 112, 97, 254,  85,
          187, 122, 167, 155,  35,  70, 15, 210, 159,
          255,  80,  30, 164, 185, 140, 18,  72,  84,
          141,   0, 120,   4, 196, 116, 72, 243,  64,
            2,   0
        ]
    )
})

test('Decode GetGeneration message', t => {
    const message = new GetGenerationMessage({
        vsn: 1,
        hash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
        forward: false,
    })

    t.deepEqual(
        encoder.decode(new Uint8Array([
            0,   8, 227,   1, 160, 112, 97, 254,  85,
          187, 122, 167, 155,  35,  70, 15, 210, 159,
          255,  80,  30, 164, 185, 140, 18,  72,  84,
          141,   0, 120,   4, 196, 116, 72, 243,  64,
            2,   0
        ])),
        message
    )
})

const transactionMessage = new TransactionsMessage({
    vsn: 1,
    transactions: [
        new ChainObject('signed_tx', {
            transaction: new ChainObject('spend_tx', {
                amount: 20000n,
                fee: 19300000000000n,
                nonce: 9027134n,
                payload: 'ba_NzY2NzY5OmtoX2NNaERKdEQ2TXp1WWN4U2RmclY4ZnlLMVczdTFkdG96THBMa0pqVVZxcjlpM2VmczE6bWhfeE1hYjNNUGVtTGkzREpReHRaV25ZTHp4WGJYWXEzZ1pkY25BTkpVOGlhVk1IcGQ5NjoxNjgyNDExNDAwEsem0g==',
                recipient: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
                sender: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
                ttl: 766779n,
            }),
            signatures: ['sg_aCYXPaanvbRGNxK6n2UcYv2WxpU8uPEAN7KTK7xWZV8A94WusQCWwcSSgKweRspaEtcygaoRkQ9u7n2s2mcgknxZYJ96V']
        })
    ]
})

const transactionMessageBinary = [
    0,   9, 249,   1,  41,   1, 249,   1,  37, 185,   1,  34,
  249,   1,  31,  11,   1, 248,  66, 184,  64, 253, 194, 139,
  240,  16, 159, 222,  79, 103, 182,   9, 225, 200,  99, 135,
   77,  49, 164,  79, 188, 175, 148, 205, 219,  37,  14, 248,
   28, 254,  12,   1,  40, 246, 170, 250, 122,  96, 135, 165,
  115,  71,  69, 115,  35,  69,  63, 127, 253,  52, 183, 115,
  197,   9,  68,  53, 204, 140, 246,  51,  43, 231,  53,  48,
   12, 184, 215, 248, 213,  12,   1, 161,   1, 234, 108, 123,
  148,  81, 247, 177,  44, 175, 199,  65, 254,  34, 194, 169,
  172,  35,  70, 135, 146, 156,  22,   7, 104,  16,  11,  42,
   67,  76, 117,  41,   3, 161,   1, 234, 108, 123, 148,  81,
  247, 177,  44, 175, 199,  65, 254,  34, 194, 169, 172,  35,
   70, 135, 146, 156,  22,   7, 104,  16,  11,  42,  67,  76,
  117,  41,   3, 130,  78,  32, 134,  17, 141, 161, 164, 232,
    0, 131,  11, 179,  59, 131, 137, 190,  62, 184, 123,  55,
   54,  54,  55,  54,  57,  58, 107, 104,  95,  99,  77, 104,
   68,  74, 116,  68,  54,  77, 122, 117,  89,  99, 120,  83,
  100, 102, 114,  86,  56, 102, 121,  75,  49,  87,  51, 117,
   49, 100, 116, 111, 122,  76, 112,  76, 107,  74, 106,  85,
   86, 113, 114,  57, 105,  51, 101, 102, 115,  49,  58, 109,
  104,  95, 120,  77,  97,  98,  51,  77,  80, 101, 109,  76,
  105,  51,  68,  74,  81, 120, 116,  90,  87, 110,  89,  76,
  122, 120,  88,  98,  88,  89, 113,  51, 103,  90, 100,  99,
  110,  65,  78,  74,  85,  56, 105,  97,  86,  77,  72, 112,
  100,  57,  54,  58,  49,  54,  56,  50,  52,  49,  49,  52,
   48,  48
]

test('Encode Transactions message', t => {
    t.deepEqual(
        encoder.encode(transactionMessage),
        transactionMessageBinary
    )
})

test('Decode Transactions message', t => {
    t.deepEqual(
        encoder.decode(new Uint8Array(transactionMessageBinary)),
        transactionMessage
    )
})

const microBlockMessage = new MicroBlockMessage({
    light: true,
    microBlock: new ChainObject('light_micro_block', {
        vsn: 5n,
        header: {
            version: 5n,
            flags: 0n,
            height: 766360n,
            prevHash: 'mh_2PQiVSEG1Yhjc9mNZxdjEEHoSaeSptXPJ9RV8VcMHuB59zxwGJ',
            prevKeyHash: 'kh_oakHZhkqsPWGdF7y5xUhPHYUEsgUqUJ1bqtauktFrhsm2rsgZ',
            stateHash: 'bs_21KHSDxPEqGJ7KRnA9KnHVZCcTyoNPK4H6EccLvbpfRs9NbDRS',
            txsHash: 'bx_2c3zuFEBtZHFhiF4eYa83b393gdrC6WNG4aiFwV6fHNSx74c2U',
            time: 1682334788843n,
            signature: 'sg_AR7Br6Jc8hoA1Xm2rTTPVA82xMQcngiXXB8wj3Nt6NpjShJ55XzLqrD6BPMnwLS9CRrkzpSku3P2d4efGipK5RKTUZXTm',
        },
        txHashes: [
            'th_kofhMb8n4JNtaRJQt4i1dwHXFkC6ot9Q3bFfKNRvoHJR2vycJ'
        ],
        pof: [],
    })
})

const microBlockMessageBinary = [
    0,11,249,1,6,1,185,1,1,248,255,102,5,184,216,0,0,0,5,0,
    0,0,0,0,0,0,0,0,11,177,152,182,148,5,159,169,124,30,142,
    164,157,208,64,190,205,157,82,45,240,243,244,208,84,47,
    13,125,18,54,101,246,178,14,242,105,197,14,84,84,48,248,
    195,37,214,221,22,172,48,15,200,37,79,38,127,230,6,44,
    76,54,149,62,88,123,123,160,227,132,105,111,241,174,219,
    181,152,8,223,253,255,131,37,26,204,46,152,107,81,156,
    56,174,203,198,181,25,227,246,91,203,47,211,73,6,137,70,
    7,78,103,120,80,54,100,111,133,46,20,96,175,10,134,70,
    146,157,231,164,50,76,191,150,169,139,57,0,0,1,135,178,
    247,172,235,71,248,35,108,21,241,167,185,40,49,47,14,37,
    170,218,247,146,114,252,127,162,28,185,23,43,71,180,4,
    55,102,164,37,106,194,58,60,83,146,77,75,68,230,101,59,
    234,49,138,202,9,156,209,132,88,88,183,171,192,68,91,44,
    28,162,253,10,225,160,99,118,182,48,73,150,253,231,109,
    16,169,250,154,181,1,110,102,135,150,233,134,27,89,202,
    221,31,205,207,196,7,203,92,192,1
]

test('Encode Micro Block message', t => {
    // console.dir(encoder.encode(microBlockMessage), {maxArrayLength: null})
    t.deepEqual(
        encoder.encode(microBlockMessage),
        microBlockMessageBinary
    )
})

test('Decode Micro Block message', t => {
    t.deepEqual(
        encoder.decode(new Uint8Array(microBlockMessageBinary)),
        microBlockMessage
    )
})

const keyBlockMessage = new KeyBlockMessage({
    keyBlock: new ChainObject('key_block', {
        version: 5n,
        flags: 3221225472n,
        height: 767477n,
        prevHash: 'mh_2cty9YZ1QikpU9yQ3KBsPAGoXiqkSsdhAGAVZhV2eJ76ct1eWD',
        prevKeyHash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
        stateHash: 'bs_SuaTBC7gRFdbsgAvKJ1p4irvHfcbttovoLfqkmdSxi3mHND5y',
        miner: 'ak_25LNFMwQTijP3UWv53WvmLLgNUxcpiqteJ5dgJaHfQHXe1n8KH',
        beneficiary: 'ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688',
        target: 553713663n,
        pow: new Uint8Array(new Array(168).fill(0)),
        nonce: 16763573506821029832n,
        time: 1682683859810n,
        info: 690n,
    })
})

const keyBlockMessageBinary = [
    0,10,249,1,116,1,185,1,112,0,0,0,5,192,0,0,0,0,0,0,0,0,11,
    181,245,213,51,205,168,8,248,88,254,15,86,154,248,207,
    16,87,40,15,41,144,18,92,151,40,64,132,149,125,94,42,
    158,181,86,112,97,254,85,187,122,167,155,35,70,15,210,
    159,255,80,30,164,185,140,18,72,84,141,0,120,4,196,116,
    72,243,64,2,58,210,232,251,225,225,98,183,95,249,106,74,
    207,207,31,232,54,195,214,21,245,193,99,128,148,90,3,
    122,146,150,209,175,141,137,104,128,232,115,19,76,25,22,
    129,151,229,172,44,46,84,117,106,12,246,192,13,189,8,77,
    176,0,109,136,244,250,225,50,184,241,221,183,160,78,99,
    183,250,150,71,154,84,187,197,37,165,49,167,241,188,12,
    228,146,18,25,3,6,127,176,33,0,255,255,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,164,45,73,
    136,55,127,200,0,0,1,135,199,198,19,98,0,0,2,178
]

test('Encode Key Block message', t => {
    t.deepEqual(
        encoder.encode(keyBlockMessage),
        keyBlockMessageBinary
    )
})

test('Decode Key Block message', t => {
    t.deepEqual(
        encoder.decode(new Uint8Array(keyBlockMessageBinary)),
        keyBlockMessage
    )
})

const generationMessage = new GenerationMessage({
    forward: false,
    keyBlock: new ChainObject('key_block', {
        version: 5n,
        flags: 3221225472n,
        height: 767477n,
        prevHash: 'mh_2cty9YZ1QikpU9yQ3KBsPAGoXiqkSsdhAGAVZhV2eJ76ct1eWD',
        prevKeyHash: 'kh_rVfiLy7etewiFM3pRU5uAh2Has9m7HMYJH1psPYZHWQdDbi3b',
        stateHash: 'bs_SuaTBC7gRFdbsgAvKJ1p4irvHfcbttovoLfqkmdSxi3mHND5y',
        miner: 'ak_25LNFMwQTijP3UWv53WvmLLgNUxcpiqteJ5dgJaHfQHXe1n8KH',
        beneficiary: 'ak_2iBPH7HUz3cSDVEUWiHg76MZJ6tZooVNBmmxcgVK6VV8KAE688',
        target: 553713663n,
        pow: new Uint8Array(new Array(168).fill(0)),
        nonce: 16763573506821029832n,
        time: 1682683859810n,
        info: 690n
    }),
    microBlocks: [
        new ChainObject('micro_block', {
            header: {
                version: 5n,
                flags: 0n,
                height: 766360n,
                prevHash: 'mh_2PQiVSEG1Yhjc9mNZxdjEEHoSaeSptXPJ9RV8VcMHuB59zxwGJ',
                prevKeyHash: 'kh_oakHZhkqsPWGdF7y5xUhPHYUEsgUqUJ1bqtauktFrhsm2rsgZ',
                stateHash: 'bs_21KHSDxPEqGJ7KRnA9KnHVZCcTyoNPK4H6EccLvbpfRs9NbDRS',
                txsHash: 'bx_2c3zuFEBtZHFhiF4eYa83b393gdrC6WNG4aiFwV6fHNSx74c2U',
                time: 1682334788843n,
                signature: 'sg_AR7Br6Jc8hoA1Xm2rTTPVA82xMQcngiXXB8wj3Nt6NpjShJ55XzLqrD6BPMnwLS9CRrkzpSku3P2d4efGipK5RKTUZXTm'
            },
            body: new ChainObject('micro_block_body', {
                vsn: 5n,
                txs: [
                    new ChainObject('signed_tx', {
                        signatures: [],
                        transaction: new ChainObject('spend_tx', {
                            name: 'spend_tx',
                            sender: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
                            recipient: 'ak_2nF3Lh7djksbWLzXoNo6x59hnkyBezK8yjR53GPFgha3VdM1K8',
                            amount: 20000n,
                            fee: 19300000000000n,
                            ttl: 0n,
                            nonce: 9027134n,
                            payload: 'ba_NzY2NzY5OmtoX2NNaERKdEQ2TXp1WWN4U2RmclY4ZnlLMVczdTFkdG96THBMa0pqVVZxcjlpM2VmczE6bWhfeE1hYjNNUGVtTGkzREpReHRaV25ZTHp4WGJYWXEzZ1pkY25BTkpVOGlhVk1IcGQ5NjoxNjgyNDExNDAwEsem0g=='
                        })
                    })
                ],
                pof: [],
            })
        })
    ]
})

const generationMessageBinary = [
  0, 12, 249,3,55,1,185,1,112,0,0,0,5,192,0,0,0,0,0,0,0,0,11,181,
  245,213,51,205,168,8,248,88,254,15,86,154,248,207,16,87,
  40,15,41,144,18,92,151,40,64,132,149,125,94,42,158,181,
  86,112,97,254,85,187,122,167,155,35,70,15,210,159,255,
  80,30,164,185,140,18,72,84,141,0,120,4,196,116,72,243,
  64,2,58,210,232,251,225,225,98,183,95,249,106,74,207,
  207,31,232,54,195,214,21,245,193,99,128,148,90,3,122,
  146,150,209,175,141,137,104,128,232,115,19,76,25,22,129,
  151,229,172,44,46,84,117,106,12,246,192,13,189,8,77,176,
  0,109,136,244,250,225,50,184,241,221,183,160,78,99,183,
  250,150,71,154,84,187,197,37,165,49,167,241,188,12,228,
  146,18,25,3,6,127,176,33,0,255,255,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,232,164,45,73,136,
  55,127,200,0,0,1,135,199,198,19,98,0,0,2,178,249,1,191,
  185,1,188,0,0,0,5,0,0,0,0,0,0,0,0,0,11,177,152,182,148,
  5,159,169,124,30,142,164,157,208,64,190,205,157,82,45,
  240,243,244,208,84,47,13,125,18,54,101,246,178,14,242,
  105,197,14,84,84,48,248,195,37,214,221,22,172,48,15,200,
  37,79,38,127,230,6,44,76,54,149,62,88,123,123,160,227,
  132,105,111,241,174,219,181,152,8,223,253,255,131,37,26,
  204,46,152,107,81,156,56,174,203,198,181,25,227,246,91,
  203,47,211,73,6,137,70,7,78,103,120,80,54,100,111,133,
  46,20,96,175,10,134,70,146,157,231,164,50,76,191,150,
  169,139,57,0,0,1,135,178,247,172,235,71,248,35,108,21,
  241,167,185,40,49,47,14,37,170,218,247,146,114,252,127,
  162,28,185,23,43,71,180,4,55,102,164,37,106,194,58,60,
  83,146,77,75,68,230,101,59,234,49,138,202,9,156,209,132,
  88,88,183,171,192,68,91,44,28,162,253,10,248,226,101,5,
  248,221,184,219,248,217,11,1,192,184,212,248,210,12,1,
  161,1,234,108,123,148,81,247,177,44,175,199,65,254,34,
  194,169,172,35,70,135,146,156,22,7,104,16,11,42,67,76,
  117,41,3,161,1,234,108,123,148,81,247,177,44,175,199,65,
  254,34,194,169,172,35,70,135,146,156,22,7,104,16,11,42,
  67,76,117,41,3,130,78,32,134,17,141,161,164,232,0,0,131,
  137,190,62,184,123,55,54,54,55,54,57,58,107,104,95,99,
  77,104,68,74,116,68,54,77,122,117,89,99,120,83,100,102,
  114,86,56,102,121,75,49,87,51,117,49,100,116,111,122,76,
  112,76,107,74,106,85,86,113,114,57,105,51,101,102,115,
  49,58,109,104,95,120,77,97,98,51,77,80,101,109,76,105,
  51,68,74,81,120,116,90,87,110,89,76,122,120,88,98,88,89,
  113,51,103,90,100,99,110,65,78,74,85,56,105,97,86,77,72,
  112,100,57,54,58,49,54,56,50,52,49,49,52,48,48,192,0
]

test('Encode Generation message', t => {
    t.deepEqual(
        encoder.encode(generationMessage),
        generationMessageBinary
    )
})

test('Decode Generation message', t => {
    t.deepEqual(
        encoder.decode(new Uint8Array(generationMessageBinary)),
        generationMessage
    )
})

const genesisGenerationMessage = new GenerationMessage({
    forward: true,
    keyBlock: new ChainObject('key_block', {
        version: 1n,
        flags: 2147483648n,
        height: 0n,
        prevHash: 'mh_2CipHmrBcC5LrmnggBrAGuxAf2fPDrAt79asKnadME4nyPRzBL',
        prevKeyHash: 'kh_11111111111111111111111111111111273Yts',
        stateHash: 'bs_2aBz1QS23piMnSmZGwQk8iNCHLBdHSycPBbA5SHuScuYfHATit',
        miner: 'ak_11111111111111111111111111111111273Yts',
        beneficiary: 'ak_11111111111111111111111111111111273Yts',
        target: 553713663n,
        pow: new Uint8Array(Array(168).fill(0)),
        nonce: 0n,
        time: 0n,
    }),
    microBlocks: []
})

const genesisGenerationMessageBinary = [
    0,12,249,1,114,1,185,1,108,0,0,0,1,128,
    0,0,0,0,0,0,0,0,0,0,0,158,
    79,89,57,49,136,245,229,211,220,44,167,79,
    151,117,42,149,176,13,160,196,61,156,179,95,
    106,250,133,59,93,3,170,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,207,14,125,41,37,121,177,152,90,
    44,169,26,242,102,7,35,207,106,113,25,70,
    151,21,111,130,36,232,186,254,232,52,26,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,33,0,255,255,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,192,
    1
]

test('Encode Genesis Generation message', t => {
    t.deepEqual(
        encoder.encode(genesisGenerationMessage),
        genesisGenerationMessageBinary
    )
})

test('Decode Genesis Generation message', t => {
    t.deepEqual(
        encoder.decode(new Uint8Array(genesisGenerationMessageBinary)),
        genesisGenerationMessage
    )
})
