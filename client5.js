
var config = {
    sdpSemantics: 'unified-plan',
    iceServers: [
        {
            urls: ['stun:stun.l.google.com:19302']
        },
        {
            urls: ["turn:35.247.173.254:3478"],
            username: "username",
            credential: "password"
        },
        {
            urls: ["turn:numb.viagenie.ca"],
            credential: "muazkh",
            username: "webrtc@live.com"
        }
    ]
};

var peerconnection = new RTCPeerConnection(config)

var iceConnectionLog = document.getElementById('ice-connection-state'),
    iceGatheringLog = document.getElementById('ice-gathering-state'),
    signalingLog = document.getElementById('signaling-state');
localSessionDescription = document.getElementById('localSessionDescription')

let log = msg => {
    document.getElementById('logs').innerHTML += msg + '<br>'
}

let displayVideo = video => {
    var el = document.createElement('video')
    el.srcObject = video
    el.autoplay = true
    el.muted = true
    el.width = 160
    el.height = 120

    document.getElementById('localVideos').appendChild(el)
    return video
}

navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(async stream => {
        await peerconnection.addStream(displayVideo(stream))
        let d = await peerconnection.createOffer()
        await peerconnection.setLocalDescription(d)
        return d
    })
    .then((d) => {
        return fetch('/sendoffer', {
            body: JSON.stringify({
                "sdp": d.sdp,
                "type": d.type,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
    })
    .catch(log)

peerconnection.oniceconnectionstatechange = e => log(peerconnection.iceConnectionState)

peerconnection.onicecandidate = event => {
    if (event.candidate === null) {
        document.getElementById('localSessionDescription').value = btoa(JSON.stringify(peerconnection.localDescription))
    }
}

async function start() {

    let { answer } = await fetch('/getanswer', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    })
        .then(resp => resp.json())

    document.getElementById('remoteSessionDescription').value = btoa(JSON.stringify(answer))

    let sd = document.getElementById('remoteSessionDescription').value

    if (sd === '') {
        return alert('Session Description must not be empty')
    }

    // register some listeners to help debugging
    peerconnection.addEventListener('icegatheringstatechange', function () {
        iceGatheringLog.textContent += ' -> ' + peerconnection.iceGatheringState;
    }, false);
    iceGatheringLog.textContent = peerconnection.iceGatheringState;

    peerconnection.addEventListener('iceconnectionstatechange', function () {
        iceConnectionLog.textContent += ' -> ' + peerconnection.iceConnectionState;
    }, false);
    iceConnectionLog.textContent = peerconnection.iceConnectionState;

    peerconnection.addEventListener('signalingstatechange', function () {
        signalingLog.textContent += ' -> ' + peerconnection.signalingState;
    }, false);
    signalingLog.textContent = peerconnection.signalingState;

    try {
        peerconnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
    } catch (e) {
        log(e)
    }
}

