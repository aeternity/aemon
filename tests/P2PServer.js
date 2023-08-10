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

const randomPort = () => {
    const min = 30015
    const max = 40000

    return Math.floor(Math.random() * (max - min) + min)
}

const fixtures = () => {
    const clientKeypair = {
        pub: 'pp_2Kwvz5XJujZDPtE5WtuwSy8Ue8W6STq9qHhmrXABevLBgCcswY',
        prv: 'pp_2H1vmsrHirjFxVPgNzDkufDaxFxiwe9dtCB2hRe6xWjtkZCbvR'
    }

    const serverKeypair = {
        pub: 'pp_2s6CoAr8tKWN3SMfaauZZXu1Fr7tr8x6BTGoY4kBmCozQi68Bc',
        prv: 'pp_2mcSsrqC72Lr4YYMZb6zqS8Zd5un4LKRwKphyuqfVd2zCrTEcV'
    }

    const network = new P2PNetwork('test', 'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z')
    const clientPeer = new Peer('localhost', randomPort(), clientKeypair)
    const serverPeer = new Peer('localhost', randomPort(), serverKeypair)

    return {
        network,
        clientPeer,
        serverPeer
    }
}

test('P2P client/server', t => {
    const {network, clientPeer, serverPeer} = fixtures()

    const client = new P2PClient(network, clientPeer, serverPeer)
    const server = new P2PServer(network, serverPeer)

    return new Promise((resolve, reject) => {
        client.connection.on('connect', () => {
            client.connection.ping(clientPeer)
        })

        client.connection.on('pong', (ping) => {
            t.is(serverPeer.port, ping.port)
            resolve()
        })

        server.listen(serverPeer.port, 'localhost')
        client.connect()
    })
})

test('Sets remote peer public key from existing peers database', t => {
    const {network, clientPeer, serverPeer} = fixtures()

    const existingPeer = new Peer('127.0.0.1', clientPeer.port, clientPeer.keypair)
    network.addPeer(existingPeer)

    const client = new P2PClient(network, clientPeer, serverPeer)
    const server = new P2PServer(network, serverPeer)
    server.connectOnStart = false

    return new Promise((resolve, reject) => {
        server.on('connection', (connection) => {
            t.is(clientPeer.publicKey, connection.peer.publicKey)
            resolve()
        })

        server.listen(serverPeer.port, 'localhost')
        client.connect()
    })
})
