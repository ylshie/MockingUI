import Recorder from "./recorder";

let fnRecorderReady = null;
let fnAudioReady    = null;
let audio_context   = null;
let recorder        = null;

export function recordMic2(onRecorderReady, onAudioReady) {
    fnRecorderReady = onRecorderReady;
    fnAudioReady    = onAudioReady;

    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        window.URL = window.URL || window.webkitURL;
        
        audio_context = new AudioContext;
        __log('Audio context set up.');
        __log('navigator.getUserMedia ' + (navigator.mediaDevices.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }
    
    const constraints = {
        //audio: {
            channelCount: 1,
            sampleRate: 16000, //16000,
            sampleSize: 16,
            //volume: 1
        //}
    }
    
    navigator.mediaDevices.getUserMedia({audio: true})
                          .then(startUserMedia)
                          .catch((e) => __log('No live audio input: ' + e));
};

function __log(e, data) {
    //log.innerHTML += "\n" + e + " " + (data || '');
    console.log(e, data);
}

function startUserMedia(stream) {
    //if (recorder != null) return;

    var input = audio_context.createMediaStreamSource(stream);
    __log('Media stream created.', input, audio_context, stream);

    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
    const sampleRate = audio_context.sampleRate;
    recorder = new Recorder(input);
    if (fnRecorderReady) fnRecorderReady(recorder);
    __log('Recorder initialised.');
}

export function startRecording() {
    recorder && recorder.record();
    __log('Recording...', recorder);
}

export function stopRecording(fnCallback) {
    recorder && recorder.stop();
    __log('Stopped recording.', recorder);
    
    // create WAV download link using audio data blob
    createDownloadLink(fnCallback);
    
    recorder && recorder.clear();
}

function createDownloadLink(fnCallback) {
    //recorder && recorder.exportWAV(fnAudioReady)
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);
        var audio = document.createElement('audio');
        const sampleRate = audio_context.sampleRate;
      
        audio.src = url;
        audio.playsInline = true;
        audio.hidden = true;
        console.log("recorder exportWAV", recorder);

        document.body.appendChild(audio);

        const callback = (fnCallback)? fnCallback: fnAudioReady;
        if (callback) callback(audio, blob, sampleRate);
    });
}
