import { startDesktop } from "./camcorder";

// Global State
const servers = {
    iceServers: [{
        urls: [ 'stun:stun1.l.google.com:19302', 
                'stun:stun2.l.google.com:19302'],
    },],
    iceCandidatePoolSize: 10,
};
export var rtcMsg  = {}
let myRoom  = "none";
let myRole  = "none";
let myName  = false;
export var paired       = false;
export var pairaction   = null;
let pc = null;    //new RTCPeerConnection(servers);
let localStream     = null;
let remoteStream    = null;
let connection      = null;

export function createRemoteVideo(elmDIV) {
    const remote    = document.createElement("video");
    
    remote.id = "remoteVideo";
    remote.crossOrigin = "anonymous";
    remote.controls = true;
    remote.muted = true;
    remote.playsInline = true;
    remote.autoplay = true;
    console.log("remote, remote")
    remote.setAttribute('width',  300);
    remote.setAttribute('height', 200);

    if (elmDIV) elmDIV.appendChild(remote);

    return remote
}

export function OnRTC(json) {
    console.log(json);
    const handler = rtcMsg[json.action]
    if (handler) handler(json.data);
}
export function OnPair() {
    setPaired(true)
    console.log("paired");
    if (pairaction) {
        const action = pairaction;
        setTimeout(()=>{
            console.log("call action",action);
            action()
        },10000);
        setPairAction(null);
    }
}
export function setPaired(value) {
    paired = value;
}
export function setPairAction(action) {
    pairaction = action;
}
/*
    pc: remote connection
*/
//const localTracks = [];
const remoteTracks = [];
export function rtcDisconnectPeer(remote) {
    if (pc != null) {
        pc.close();
        pc = null;
    }
}
export function rtcConnectPeer(room, role, name, conn, local, remote) {
    pc = new RTCPeerConnection(servers);
    //pc.addTransceiver('video', {direction: 'recvonly'});
    console.log("rtcConnectPeer",room, role, name)
    myRoom  = room;
    myRole  = role;
    myName  = name;
    connection      = conn;
    localStream     = local.srcObject;
    remoteStream    = new MediaStream();

    // Push tracks from local stream to peer connection
    const list = [];
    //if (role == "master") {
        localStream.getTracks().forEach((track) => {
            const sender = pc.addTrack(track, localStream);
            list.push({track: track, sender: sender});
            console.log("add local stream to peer",localStream, track, sender);
        });
    //}
    /*
    if (role == "slave") {
        startDesktop().then((stream) => {
            console.log("startDesktop", stream);
            stream.getTracks().forEach((track) => {
                const sender = pc.addTrack(track, stream);
                console.log("add desktop stream to peer",stream, track, sender);
            });
        });
    }
    */
    //localTracks[room] = list;

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
        const list = [];
        //remoteStream    = new MediaStream();
        console.log("ontrack", event, event.streams[0], event.streams[0].getTracks());
        if (event.streams.length > 1) {
            console.log("ontrack", event, event.streams[1], event.streams[1].getTracks());
        }
        event.streams[0].getTracks().forEach((track) => {
            const sender = remoteStream.addTrack(track);
            list.push({stream: remoteStream, track: track, sender: sender});
            console.log("add remote stream from peer", remoteStream, track, sender, track.label);
        });
        remoteTracks[room] = list;
    };
    // Arthur
    remote.srcObject = remoteStream;

    //  set api
    if (myRole == "master") {
        rtcMsg['candidate'] = onMasterCandidate;
        rtcMsg['sdp']       = onMasterSDP;
        if (paired) {
            console.log("paired rtccall")
            rtcCall();
        } else {
            console.log("paired waitting")
            pairaction = rtcCall;
        }
    } else {
        rtcMsg['candidate'] = onSlaveCandidate;
        rtcMsg['sdp']       = onSlaveSDP;
    }
}

export function onMasterCandidate(data) {
    console.log("addIceCandidate",data);
    const candidate = (data)? new RTCIceCandidate(data): null;
    (candidate)? pc.addIceCandidate(candidate): console.log("addIceCandidate null");
}

export function onMasterSDP(data) {
    console.log("onMasterSDP",data)
    const answerDescription = (data)? new RTCSessionDescription(data): null;
    (answerDescription) ? pc.setRemoteDescription(answerDescription): console.log("setRemoteDescription null");
}

export function onSlaveCandidate(data) {
    console.log("addIceCandidate", data);
    const candidate = (data) ? new RTCIceCandidate(data): null;
    (candidate) ? pc.addIceCandidate(candidate): console.log("addIceCandidate error");
}

export function onSlaveSDP(data) {
    console.log("onSlaveSDP",data)
    rtcAnswer(data);
}

export async function rtcCall() {
    console.log("rtcCall")
    pc.onicecandidate = (event) => {
        console.log("onicecandidate candidate=", event.candidate)
        //event.candidate && offerCandidates.add(event.candidate.toJSON());
        const json      = {type: "rtc", room: myRoom, role: myRole, name: myName, action: "candidate", data: event.candidate};
        const message   = JSON.stringify(json);
        connection.send(message);
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    console.log("setLocalDescription", offerDescription)
    await pc.setLocalDescription(offerDescription);

    const offer = {
         sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    {
        const json      = {type: "rtc", room: myRoom, role: myRole, name: myName, action: "sdp",data: offer};
        const message   = JSON.stringify(json);
        connection.send(message);
    }
}

async function rtcAnswer(remoetOffer) {
    console.log("rtcAnswer", remoetOffer)
    pc.onicecandidate = (event) => {
        console.log("[slave] answer onicecandidate = ", event.candidate)
        //event.candidate && answerCandidates.add(event.candidate.toJSON());
        //event.candidate && offerCandidates.add(event.candidate.toJSON());
        const json      = {type: "rtc", room: myRoom, role: myRole, name: myName, action: "candidate",data: event.candidate};
        const message   = JSON.stringify(json);
        connection.send(message);
    };
    ///*
    //const callData = (await callDoc.get()).data();
    //const offerDescription = callData.offer;
    const offerDescription = remoetOffer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
    };

    //await callDoc.update({ answer });
    {
        const json      = {type: "rtc", room: myRoom, role: myRole, name: myName, action: "sdp", data: answer};
        const message   = JSON.stringify(json);
        connection.send(message);
    }
}


