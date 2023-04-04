import net from 'net'
import stream from 'stream'
import test from 'ava'
import P2PNetwork from '../src/P2PNetwork.js'
import P2PClient from '../src/P2PClient.js'
import P2PServer from '../src/P2PServer.js'
import P2PScanner from '../src/P2PScanner.js'
import Peer from '../src/Peer.js'
import InMemoryMetrics from '../src/Metrics/InMemoryMetrics.js'

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

test('Connects to initial network peers', t => {
    const {network, clientPeer, serverPeer} = fixtures()

    const server = new P2PServer(network, serverPeer)
    const scanner = new P2PScanner(network, clientPeer, new InMemoryMetrics())

    network.addPeer(serverPeer)

    return new Promise((resolve, reject) => {
        scanner.on('connection', (connection) => {
            t.is(serverPeer.publicKey, connection.peer.publicKey)
            scanner.stop()
            resolve()
        })


        server.listen(serverPeer.port, 'localhost')
        scanner.scan()
    })
})

test('Listens for peer connections', t => {
    const {network, clientPeer, serverPeer} = fixtures()

    const client = new P2PClient(network, clientPeer, serverPeer)
    const scanner = new P2PScanner(network, serverPeer, new InMemoryMetrics())
    
    return new Promise((resolve, reject) => {
        client.connection.on('connect', () => {
            client.ping()
        })

        client.connection.on('pong', (ping) => {
            t.is(serverPeer.port, ping.port)
            client.disconnect()
            scanner.stop()
            resolve()
        })

        scanner.scan(serverPeer.port, 'localhost')
        client.connect()
    })
})
