
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

pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        pc.addStream(displayVideo(stream))
        pc.createOffer().then(d => {
            pc.setLocalDescription(new RTCSessionDescription(d))

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
            .then(resp => console.log(resp))
            .catch(e => log(e))
        }).catch(log)
    }).catch(log)

function start() {
    return fetch('/getanswer', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    })
    .then(resp => resp.json())
    .then(resp => {
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
        answer = resp['answer']
        console.log("client3 answer", answer.sdp)
        return pc.setRemoteDescription(new RTCSessionDescription(answer))
    })
    .catch(err => alert(err))
}