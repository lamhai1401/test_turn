
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

var pc = new RTCPeerConnection(config)

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

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        pc.addStream(displayVideo(stream))
        pc.createOffer().then(d => {
            return pc.setLocalDescription(d)
        }).catch(log)
    }).catch(log)

pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)

pc.onicecandidate = event => {
    if (event.candidate === null) {
        document.getElementById('localSessionDescription').value = btoa(JSON.stringify(pc.localDescription))
    }
}

function start() {
    let sd = document.getElementById('remoteSessionDescription').value

    if (sd === '') {
        return alert('Session Description must not be empty')
    }

    // register some listeners to help debugging
    pc.addEventListener('icegatheringstatechange', function () {
        iceGatheringLog.textContent += ' -> ' + pc.iceGatheringState;
    }, false);
    iceGatheringLog.textContent = pc.iceGatheringState;

    pc.addEventListener('iceconnectionstatechange', function () {
        iceConnectionLog.textContent += ' -> ' + pc.iceConnectionState;
    }, false);
    iceConnectionLog.textContent = pc.iceConnectionState;

    pc.addEventListener('signalingstatechange', function () {
        signalingLog.textContent += ' -> ' + pc.signalingState;
    }, false);
    signalingLog.textContent = pc.signalingState;

    try {
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
    } catch (e) {
        log(e)
    }
}

