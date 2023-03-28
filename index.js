import P2PNetwork from './src/P2PNetwork.js'
import P2PScanner from './src/P2PScanner.js'
import Peer from './src/Peer.js'

const devnet = new P2PNetwork(
    'devnet',
    'kh_2KhFJSdz1BwrvEWe9fFBRBpWoweoaZuTiYLWwUPh21ptuDE8UQ',
    [
        'aenode://pp_2Kwvz5XJujZDPtE5WtuwSy8Ue8W6STq9qHhmrXABevLBgCcswY@127.0.0.1:30015',
    ]
)

const localnet = new P2PNetwork(
    'devnet',
    'kh_2KhFJSdz1BwrvEWe9fFBRBpWoweoaZuTiYLWwUPh21ptuDE8UQ',
    [
        'aenode://pp_acoYFZB3zfxaJf7EseYsLPXALBb2uXwwGVDH9J1CkWZyCeM11@127.0.0.1:3015',
        // 'aenode://pp_2Kwvz5XJujZDPtE5WtuwSy8Ue8W6STq9qHhmrXABevLBgCcswY@127.0.0.1:30015',
        'aenode://pp_2s6CoAr8tKWN3SMfaauZZXu1Fr7tr8x6BTGoY4kBmCozQi68Bc@127.0.0.1:30015',
    ]
)

const testnet = new P2PNetwork(
    'ae_uat',
    'kh_wUCideEB8aDtUaiHCtKcfywU6oHZW6gnyci8Mw6S1RSTCnCRu',
    [
        // 'aenode://pp_2Kwvz5XJujZDPtE5WtuwSy8Ue8W6STq9qHhmrXABevLBgCcswY@127.0.0.1:30015',
        'aenode://pp_QU9CvhAQH56a2kA15tCnWPRJ2srMJW8ZmfbbFTAy7eG4o16Bf@52.10.46.160:3015',
        'aenode://pp_2vhFb3HtHd1S7ynbpbFnEdph1tnDXFSfu4NGtq46S2eM5HCdbC@18.195.109.60:3015',
        'aenode://pp_27xmgQ4N1E3QwHyoutLtZsHW5DSW4zneQJ3CxT5JbUejxtFuAu@13.250.162.250:3015',
        'aenode://pp_2i8N6XsjCGe1wkdMhDRs7t7xzijrjJDN4xA22RoNGCgt6ay9QB@31.13.249.70:3015',
    ]
)

const mainnet = new P2PNetwork(
    'ae_mainnet',
    'kh_pbtwgLrNu23k9PA6XCZnUbtsvEFeQGgavY4FS2do3QP8kcp2z',
    [
        'aenode://pp_2gPZjuPnJnTVEbrB9Qgv7f4MdhM4Jh6PD22mB2iBA1g7FRvHTk@52.220.198.72:3015',
    ]
)

const NETWORK = localnet

const externalIP = '127.0.0.1'
const externalPort = 30015
const keypair = {
    pub: 'pp_2s6CoAr8tKWN3SMfaauZZXu1Fr7tr8x6BTGoY4kBmCozQi68Bc',
    prv: 'pp_2mcSsrqC72Lr4YYMZb6zqS8Zd5un4LKRwKphyuqfVd2zCrTEcV'
}

const localPeer = new Peer(externalIP, externalPort, keypair)
const scanner = new P2PScanner(NETWORK, localPeer)
scanner.printStats()
scanner.scan()
