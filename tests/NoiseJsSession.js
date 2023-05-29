import test from 'ava'
import NoiseJsSession from '../src/NoiseJsSession.js'


test('Basic Handshake', t => {
    const [iPrv, iPub] = NoiseJsSession.createKeyPair()
    const [rPrv, rPub] = NoiseJsSession.createKeyPair()
    const initiator = new NoiseJsSession(NoiseJsSession.ROLE_INITIATOR, null, iPrv, rPub)
    const responder = new NoiseJsSession(NoiseJsSession.ROLE_RESPONDER, null, rPrv)

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
