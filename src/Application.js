import http from 'http'
import Peer from './Peer.js'
import P2PNetwork from './P2PNetwork.js'
import P2PScanner from './P2PScanner.js'
import NetworkMetrics from './Metrics/NetworkMetrics.js'
import PrometheusMetrics from './Metrics/PrometheusMetrics.js'
import NoiseWasmSession from './NoiseWasmSession.js'
import {FateApiEncoder} from '@aeternity/aepp-calldata'

const createKeyPair = (argv) => {
    let keypair = {pub: argv.publicKey, prv: argv.privateKey}

    if (keypair.pub !== undefined) {
        console.log('Keypair provided', keypair)
        return keypair
    }

    const apiEncoder = new FateApiEncoder()
    const [prv, pub] = NoiseWasmSession.createKeyPair()
    keypair = {
        pub: apiEncoder.encode('peer_pubkey', pub),
        prv: apiEncoder.encode('peer_pubkey', prv),
    }

    console.log('Keypair not provided, generating', keypair)
    return keypair
}

export default class Application {
    constructor(argv) {
        const keypair = createKeyPair(argv)
        const peer = new Peer(argv.sourceAddress, argv.externalPort, keypair)

        this.network = new P2PNetwork(argv.networkId, argv.genesisHash, argv.peers)
        this.metrics = new NetworkMetrics(new PrometheusMetrics(), this.network)

        this.scanner = new P2PScanner(this.network, peer, this.metrics)
        this.scanner.setOption('enableServer', argv.enableServer)
        this.scanner.setOption('connectOnStart', argv.connectOnStart)
        this.scanner.setOption('connectOnDiscovery', argv.connectOnDiscovery)

        this.sourceAddress = argv.sourceAddress
        this.sourcePort = argv.sourcePort
        this.metricsPort = argv.metricsPort
        this.enableMetrics = argv.enableMetrics
        this.enableServer = argv.enableServer
    }

    start() {
        if (!this.enableServer) {
            this.installTicker()
        }

        this.scanner.start(this.sourcePort, this.sourceAddress)

        if (this.enableMetrics) {
            this.metricsServer = http.createServer(async (req, res) => {
                res.write(await this.metrics.dump())
                res.end()
            }).listen((this.metricsPort), () => {
                console.log("Metrics Server is Running on port 3000")
            })
        }
    }

    stop() {
        if (this.enableMetrics) {
            this.metricsServer.stop()
        }

        if (!this.enableServer) {
            clearInterval(this.ticker)
        }

        this.scanner.stop()
        console.log(this.network.toString())
    }

    installTicker() {
        const callback = async () => {
            if (this.scanner.connections.size === 0) {
                this.stop()
            }
        }

        this.ticker = setInterval(callback.bind(this), 500)
    }
}
