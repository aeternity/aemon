import http from 'http'
import winston from 'winston'
import Peer from './Peer.js'
import P2PNetwork from './P2PNetwork.js'
import P2PScanner from './P2PScanner.js'
import NetworkMetrics from './Metrics/NetworkMetrics.js'
import PrometheusMetrics from './Metrics/PrometheusMetrics.js'
import NoiseWasmSession from './NoiseWasmSession.js'
import {FateApiEncoder} from '@aeternity/aepp-calldata'

// The log formatter is using JSON.stringify and this "fix" it's serialization issues
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
BigInt.prototype.toJSON = function() { return this.toString() }

const createKeyPair = (argv, logger) => {
    let keypair = {pub: argv.publicKey, prv: argv.privateKey}

    if (keypair.pub !== undefined) {
        logger.log({level: 'info', message: 'Using static keypair', keypair})
        return keypair
    }

    const apiEncoder = new FateApiEncoder()
    const [prv, pub] = NoiseWasmSession.createKeyPair()
    keypair = {
        pub: apiEncoder.encode('peer_pubkey', pub),
        prv: apiEncoder.encode('peer_pubkey', prv),
    }

    logger.log('info', 'Keypair not provided, generating new', keypair)

    return keypair
}

const logFormat = (format) => {
    switch (format) {
        case 'json':
            return winston.format.json()
        case 'pretty':
            return winston.format.prettyPrint()
        case 'cli':
            return winston.format.cli()
        case 'simple':
            return winston.format.simple()
        default:
            return winston.format.printf((info) => {
                const { level, message, timestamp, ...meta } = info
                return `${timestamp} [${level.toUpperCase()}]: ${message}` + (Object.keys(meta).length ? ` --- ${JSON.stringify(meta)}` : '')
            })
    }
}

const createLogger = (argv) => {
    return winston.createLogger({
        level: argv.logLevel,
        format: winston.format.combine(
            // winston.format.metadata(),
            winston.format.timestamp(),
            logFormat(argv.logFormat),
        ),
        // defaultMeta: { service: 'user-service' },
        transports: [
            new winston.transports.Console()
        ],
    })
}

export default class Application {
    constructor(argv) {
        this.logger = createLogger(argv)

        const keypair = createKeyPair(argv, this.logger)
        const peer = new Peer(argv.sourceAddress, argv.externalPort, keypair)

        this.network = new P2PNetwork(argv.networkId, argv.genesisHash, argv.peers)
        this.metrics = new NetworkMetrics(new PrometheusMetrics(), this.network)

        this.scanner = new P2PScanner(this.network, peer, this.metrics, this.logger)
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
                this.logger.log('info', `Metrics server listening on port ${this.metricsPort}`)
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
        this.logger.log('warn', 'Application stop', this.network)
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
