import test from 'ava'
import NoiseSession from '../src/NoiseSession.js'


test('Basic Handshake', t => {
    const [iPrv, iPub] = NoiseSession.createKeyPair()
    const [rPrv, rPub] = NoiseSession.createKeyPair()
    const initiator = new NoiseSession(NoiseSession.ROLE_INITIATOR, null, iPrv, rPub)
    const responder = new NoiseSession(NoiseSession.ROLE_RESPONDER, null, rPrv)

    let data = null

    t.is(initiator.isHandshaking(), true)
    t.is(responder.isHandshaking(), true)

    data = initiator.handshake()
    t.is(initiator.isHandshaking(), true)

    data = responder.handshake(data)
    t.is(responder.isHandshaking(), true)

    data = initiator.handshake(data)
    t.is(initiator.isHandshaking(), false)

    responder.handshake(data)
    t.is(responder.isHandshaking(), false)
})
