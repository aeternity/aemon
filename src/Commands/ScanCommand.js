import P2PNetwork from '../P2PNetwork.js'
import P2PScanner from '../P2PScanner.js'
import Peer from '../Peer.js'

const handler = (argv) => {
    const network = new P2PNetwork(argv.networkId, argv.genesisHash, argv.peers)
    const keypair = {pub: argv.publicKey, prv: argv.privateKey}
    const peer = new Peer(argv.sourceAddress, argv.externalPort, keypair)
    const scanner = new P2PScanner(network, peer)

    scanner.printStats()
    scanner.scan(argv.sourcePort, argv.sourceAddress)
}

const ScanCommand = {
    command: ['scan', '$0'],
    desc: 'Scan a network',
    builder: {},
    handler,
}

export default ScanCommand
