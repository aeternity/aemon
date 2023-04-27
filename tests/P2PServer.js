import net from 'net'
import stream from 'stream'
import test from 'ava'
import P2PNetwork from '../src/P2PNetwork.js'
import P2PServer from '../src/P2PServer.js'
import P2PClient from '../src/P2PClient.js'
import Peer from '../src/Peer.js'

const stub = new class {
    updatePeerLocation(peer, cb) { cb() }
}

test('P2P client/server', t => {
    const clientKeypair = {
        pub: 'pp_2Kwvz5XJujZDPtE5WtuwSy8Ue8W6STq9qHhmrXABevLBgCcswY',
        prv: 'pp_2H1vmsrHirjFxVPgNzDkufDaxFxiwe9dtCB2hRe6xWjtkZCbvR'
    }

    const serverKeypair = {
        pub: 'pp_2s6CoAr8tKWN3SMfaauZZXu1Fr7tr8x6BTGoY4kBmCozQi68Bc',
        prv: 'pp_2mcSsrqC72Lr4YYMZb6zqS8Zd5un4LKRwKphyuqfVd2zCrTEcV'
    }

    const network = new P2PNetwork('test', 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z')
    const clientPeer = new Peer('localhost', 30150, clientKeypair)
    const serverPeer = new Peer('localhost', 30015, serverKeypair)
    const client = new P2PClient(network, clientPeer, serverPeer)
    const server = new P2PServer(network, serverPeer)

    return new Promise((resolve, reject) => {
        client.connection.on('connect', () => {
            client.ping()
        })

        client.connection.on('pong', (ping) => {
            t.is(30015, ping.port)
            resolve()
        })

        server.listen(30015, 'localhost')
        client.connect()
    })
})
