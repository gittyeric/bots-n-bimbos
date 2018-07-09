// Assuming peer.js has been included

const connection = require('../connection')
if (!connection) {
    throw new Error('connection.js does not exist in project root, please see connection.example.js');
}
const basePeerId = connection.basePeerId;

const ensureFullyConnected = (peerInfo, idToName) => {
    const peer = peerInfo.peer;
    Object.keys(idToName).map((id) => {
        const peerId = basePeerId + id;
        if (peerId !== peer.id && !peerInfo.idToCall[peerId]) {
            console.log('triggering call')
            peerInfo.idToCall[peerId] = 
                peer.call(peerId, peerInfo.mediaStream);
        }
    })
}

const connect = (myId, idToName) => {
    const peer = new Peer(basePeerId + myId, { key: 'lwjd5qra8257b9' });
    peer.on('open', () => console.log('connected to PeerJS server'));
    var mediaPromise = navigator.mediaDevices.getUserMedia({ audio: true });

    return mediaPromise.then((mediaStream) => {
        const mediaStream = null;
        const idToCall = {};
        peer.on('call', (call) => {
            console.log('accepting call');
            call.answer(mediaStream);
            idToCall[call.peer] = call;
        });
        const peerInfo = {
            peer,
            mediaStream,
            idToCall,
        };
        ensureFullyConnected(peerInfo, idToName);
        return {
            stop: () => {
                peer.destroy();
            },
        };
    });
}

module.exports = {
    connect,
};
