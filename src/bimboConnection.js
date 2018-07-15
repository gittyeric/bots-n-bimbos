// Assuming easyrtc is added as global var
easyrtc.setSocketUrl(":9000");

const call = (calleeId) => {
    easyrtc.call(calleeId, () => {
        console.log("Successfully called " + calleeId);
    }, (e) => {
        if (e !== 'ALREADY_CONNECTED') {
            alert(JSON.stringify(e));
        }
        else {
            console.warn('Warning: Already connected');
        }
    })
};

const connect = () => {
    easyrtc.enableVideo(false);
    easyrtc.enableVideoReceive(false);

    let mediaSource = null;

    easyrtc.setStreamAcceptor((easyrtcid, stream) => {
        console.log('Accepting stream ' + easyrtcid);
        var audio = document.createElement('video');
        document.body.appendChild(audio);
        easyrtc.setVideoObjectSrc(audio, stream);
    });

    easyrtc.initMediaSource((loadedMediaSource) => {
        easyrtc.connect("easyrtc.audioOnly", (easyId) => {
            console.log('Connected as ' + easyId);
            mediaSource = loadedMediaSource
        }, (err) => {
            alert(JSON.stringify(err));
        })
    });

    easyrtc.setRoomOccupantListener((roomName, occupants) => {
        for (var easyrtcid in occupants) {
            call(easyrtcid);
        }
    });

    return {
        destroy: () => {
            easyrtc.hangupAll();
            easyrtc.disconnect();
        },
        setMuted: (mute) => {
            if (mediaSource) {
                mediaSource.getVideoTracks()[0].enabled = !mute
                mediaSource.getAudioTracks()[0].enabled = !mute
            }
        },
    };
};

module.exports = {
    connect,
};
