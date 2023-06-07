import {Counter, Gauge, Histogram, collectDefaultMetrics, register} from 'prom-client'

export default class PrometheusMetrics {
    constructor(prefix = 'aemon_') {
        this.metrics = {
            connections_total: new Counter({
              name: prefix + 'connections_total',
              help: 'Noise connections by state',
              labelNames: ['direction', 'networkId', 'status'],
            }),
            connections: new Gauge({
              name: prefix + 'connections',
              help: 'Currently open noise connections',
              labelNames: ['direction', 'networkId', 'status'],
            }),
            connection_errors_total: new Counter({
              name: prefix + 'connection_errors_total',
              help: 'Connection errors by type',
              labelNames: ['direction', 'networkId', 'code'],
            }),
            messages_total: new Counter({
              name: prefix + 'messages_total',
              help: 'P2P messages by type',
              labelNames: ['networkId', 'direction', 'type'],
            }),
            responses_total: new Counter({
              name: prefix + 'responses_total',
              help: 'P2P message responses by message type',
              labelNames: ['networkId', 'direction', 'type', 'errorReason'],
            }),
            peer_status: new Gauge({
              name: prefix + 'peer_status',
              help: 'Network peer status up/down',
              labelNames: ['networkId', 'host', 'port', 'publicKey', 'lat', 'lon', 'country', 'provider', 'owner', 'kind']
            }),
            peer_difficulty: new Gauge({
              name: prefix + 'peer_difficulty',
              help: 'Peer difficulty',
              labelNames: ['networkId', 'publicKey', 'genesisHash', 'syncAllowed']
            }),
            peer_info: new Gauge({
                name: prefix + 'peer_info',
                help: 'Number of reported peers and additional info',
                labelNames: ['networkId', 'host', 'port', 'publicKey', 'version', 'revision', 'vendor', 'os']
            }),
            node_peers: new Gauge({
                name: prefix + 'node_peers',
                help: 'Number of reported peers for a given peer',
                labelNames: ['networkId', 'publicKey', 'kind']
            }),
            network_height: new Gauge({
              name: prefix + 'network_height',
              help: 'Current (max) network height gossiped in the network.',
              labelNames: ['networkId']
            }),
            network_difficulty: new Gauge({
              name: prefix + 'network_difficulty',
              help: 'Network difficulty',
              labelNames: ['networkId', 'genesisHash']
            }),
            network_peers: new Gauge({
              name: prefix + 'network_peers',
              help: 'Unique network peers seen',
              labelNames: ['networkId']
            }),
            peer_latency_seconds: new Histogram({
                name: prefix + 'peer_latency_seconds',
                help: 'Ping round-trip latency in seconds.',
                buckets: [0.1, 0.3, 0.5, 1, 2],
                labelNames: ['networkId', 'publicKey']
            }),
            block_latency_seconds: new Histogram({
                name: prefix + 'block_latency_seconds',
                help: 'Blocks network propagation latency.',
                buckets: [5, 10, 20, 40, 60],
                labelNames: ['networkId', 'type']
            }),
            miner_version: new Gauge({
                name: prefix + 'miner_version',
                help: 'Miner node version gossiped in key blocks info field.',
                labelNames: ['networkId', 'beneficiary']
            }),
        }

        collectDefaultMetrics()
    }

    async dump() {
        return register.metrics()
    }

    inc(metric, labels = {}, i = 1) {
        this.metrics[metric].inc(labels, i)
    }

    dec(metric, labels = {}, i = 1) {
        this.metrics[metric].dec(labels, i)
    }

    set(metric, labels = {}, i = 1) {
        this.metrics[metric].set(labels, i)
    }

    observe(metric, labels = {}, val) {
        this.metrics[metric].observe(labels, val)
    }
}
