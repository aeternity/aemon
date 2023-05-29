import net from 'net'
import stream from 'stream'
import test from 'ava'
import P2PNetwork from '../src/P2PNetwork.js'
import P2PJsNoiseTransportFactory from '../src/P2PJsNoiseTransportFactory.js'
import CloseMessage from '../src/Messages/CloseMessage.js'

test('Noise Transport', t => {
    const iKeypair = {
        pub: 'pp_2s6CoAr8tKWN3SMfaauZZXu1Fr7tr8x6BTGoY4kBmCozQi68Bc',
        prv: 'pp_2mcSsrqC72Lr4YYMZb6zqS8Zd5un4LKRwKphyuqfVd2zCrTEcV',
    }

    const rKeypair = {
        pub: 'pp_2Kwvz5XJujZDPtE5WtuwSy8Ue8W6STq9qHhmrXABevLBgCcswY',
        prv: 'pp_2H1vmsrHirjFxVPgNzDkufDaxFxiwe9dtCB2hRe6xWjtkZCbvR',
    }
    // const iPub = 'pp_2s6CoAr8tKWN3SMfaauZZXu1Fr7tr8x6BTGoY4kBmCozQi68Bc'
    // const rPub = 'pp_2Kwvz5XJujZDPtE5WtuwSy8Ue8W6STq9qHhmrXABevLBgCcswY'
    // const rPrv = 'pp_2H1vmsrHirjFxVPgNzDkufDaxFxiwe9dtCB2hRe6xWjtkZCbvR'

    const network = new P2PNetwork('test', 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z')
    const iFactory = new P2PJsNoiseTransportFactory(network, 'initiator', iKeypair)
    const rFactory = new P2PJsNoiseTransportFactory(network, 'responder', rKeypair)

    const iPass = new stream.PassThrough()
    const rPass = new stream.PassThrough()

    const iSocket = stream.Duplex.from({
        writable: iPass,
        readable: rPass
    })

    const rSocket = stream.Duplex.from({
        writable: rPass,
        readable: iPass
    })

    const iStream = iFactory.create(iSocket, rKeypair.pub)
    const rStream = rFactory.create(rSocket)

    iStream.on('handshake', () => {
        iStream.write(new CloseMessage())
    })

    return new Promise((resolve, reject) => {
        rStream.on('data', (message) => {
            t.deepEqual(message, new CloseMessage())
            resolve()
        })
    })
})
