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

function join() {    
    let sd = document.getElementById('remoteSessionDescription').value
    if (sd === '') {
        return alert('Session Description must not be empty')
    }
    
    // register some listeners to help debugging
    pc.addEventListener('icegatheringstatechange', function() {
        iceGatheringLog.textContent += ' -> ' + pc.iceGatheringState;
    }, false);
    iceGatheringLog.textContent = pc.iceGatheringState;

    pc.addEventListener('iceconnectionstatechange', function() {
        iceConnectionLog.textContent += ' -> ' + pc.iceConnectionState;
    }, false);
    iceConnectionLog.textContent = pc.iceConnectionState;

    pc.addEventListener('signalingstatechange', function() {
        signalingLog.textContent += ' -> ' + pc.signalingState;
    }, false);
    signalingLog.textContent = pc.signalingState;

    // connect audio / video
    pc.addEventListener('track', function (evt) {
        console.log("Track event: ", evt)
        if (evt.track.kind == 'video')
          document.getElementById('video').srcObject = evt.streams[0];
        else
          document.getElementById('audio').srcObject = evt.streams[0];
    });

    console.log(2)
    return pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
    .then(() => pc.createAnswer())
    .then(async answer => {
        pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
        pc.setLocalDescription(answer)

        return new Promise(resolve => {
            pc.onicecandidate = event => {
                if (event.candidate === null) {
                    document.getElementById('localSessionDescription').value = btoa(JSON.stringify(pc.localDescription))
                    resolve()
                }
            }
        })

    })
    .catch(e => alert(e))
}

setTimeout(async() => {
    console.log("run")
    let {offer} = await fetch('/getoffer', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    })
    .then(resp => resp.json())

    console.log(offer)

    document.getElementById('remoteSessionDescription').value = btoa(JSON.stringify(offer))

    await join()

    console.log(atob(document.getElementById('localSessionDescription').value))
    
    let answer = JSON.parse(atob(document.getElementById('localSessionDescription').value))

    await fetch('/sendanswer', {
        body: JSON.stringify({
            "sdp": answer.sdp,
            "type": answer.type,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    })

    console.log("done")
})

