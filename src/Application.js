import http from 'http'
import Peer from './Peer.js'
import P2PNetwork from './P2PNetwork.js'
import P2PScanner from './P2PScanner.js'
import NetworkMetrics from './Metrics/NetworkMetrics.js'
import PrometheusMetrics from './Metrics/PrometheusMetrics.js'

export default class Application {
    constructor(argv) {
        const keypair = {pub: argv.publicKey, prv: argv.privateKey}
        const peer = new Peer(argv.sourceAddress, argv.externalPort, keypair)

        this.network = new P2PNetwork(argv.networkId, argv.genesisHash, argv.peers)
        this.metrics = new NetworkMetrics(new PrometheusMetrics(), this.network)
        this.scanner = new P2PScanner(this.network, peer, this.metrics)
        this.sourceAddress = argv.sourceAddress
        this.sourcePort = argv.sourcePort
    }

    start() {
        this.scanner.scan(this.sourcePort, this.sourceAddress)
        this.installTicker()

        this.metricsServer = http.createServer(async (req, res) => {
            res.write(await this.metrics.dump())
            res.end()
        }).listen((3000), () => {
            console.log("Metrics Server is Running on port 3000")
        })
    }

    stop() {
        this.metricsServer.stop()
        this.scanner.stop()
        clearInterval(this.ticker)
        console.log(this.network.toString())
    }

    installTicker() {
        const callback = async () => {
            // if (this.scanner.connections.size === 0) {
            //     this.stop()
            // }
        }

        this.ticker = setInterval(callback.bind(this), 500)
    }
}
