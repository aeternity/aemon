import geoip from 'geoip-lite'
import IPToASN from 'ip-to-asn'

export default class PeerLocationProvider {
    constructor() {
        this.asnClient = new IPToASN()
    }

    updatePeerLocation(peer, cb) { /* eslint-disable no-param-reassign */
        const geo = geoip.lookup(peer.host)

        if (geo !== null) {
            peer.lat = Number(geo.ll[0])
            peer.lon = Number(geo.ll[1])
            peer.country = geo.country
        }

        this.asnClient.query([peer.host], (err, results) => {
            if (err) {
                // eslint-disable-next-line no-console
                console.error(err)
                return cb()
            }

            const info = results[peer.host]
            if (info !== undefined) {
                peer.provider = `${info.description} (AS${info.ASN})`

                if (info.ASN === 'NA') {
                    peer.provider = 'N/A'
                }
            }

            return cb()
        })
    }
}
