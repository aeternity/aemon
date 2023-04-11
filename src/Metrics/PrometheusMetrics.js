import {Counter, Gauge, collectDefaultMetrics, register} from 'prom-client'

export default class PrometheusMetrics {
    constructor(prefix = 'aemon') {
        this.metrics = {
            connections_total: new Counter({
              name: prefix + '_connections_total',
              help: 'Noise connections by state',
              labelNames: ['networkId', 'status'],
            }),
            connections: new Gauge({
              name: prefix + '_connections',
              help: 'Currently open noise connections',
              labelNames: ['networkId', 'status'],
            }),
            connection_errors_total: new Counter({
              name: prefix + '_connection_errors_total',
              help: 'Connection errors by type',
              labelNames: ['networkId', 'code'],
            }),
            messages_total: new Counter({
              name: prefix + '_messages_total',
              help: 'P2P messages by type',
              labelNames: ['networkId', 'direction', 'type'],
            }),
            responses_total: new Counter({
              name: prefix + '_responses_total',
              help: 'P2P message responses by message type',
              labelNames: ['networkId', 'direction', 'type', 'errorReason'],
            }),
            peer_status: new Gauge({
              name: prefix + '_peer_status',
              help: 'Network peer status up/down',
              labelNames: ['networkId', 'host', 'port', 'publicKey', 'lat', 'lon', 'owner', 'kind']
            }),
            peer_difficulty: new Gauge({
              name: prefix + '_peer_difficulty',
              help: 'Peer difficulty',
              labelNames: ['networkId', 'publicKey', 'genesisHash', 'syncAllowed']
            }),
            peer_info: new Gauge({
                name: prefix + '_peer_info',
                help: 'Number of reported peers and additional info',
                labelNames: ['networkId', 'host', 'port', 'publicKey', 'version', 'revision', 'vendor', 'os']
            }),
            node_peers: new Gauge({
                name: prefix + '_node_peers',
                help: 'Number of reported peers for a given peer',
                labelNames: ['networkId', 'publicKey', 'kind']
            }),
            network_difficulty: new Gauge({
              name: prefix + '_network_difficulty',
              help: 'Network difficulty',
              labelNames: ['networkId', 'genesisHash']
            }),
            network_peers: new Gauge({
              name: prefix + '_network_peers',
              help: 'Unique network peers seen',
              labelNames: ['networkId']
            }),
        }

        // collectDefaultMetrics({ prefix })
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
}
