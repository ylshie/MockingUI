import styles from "./mic.module.css";
import { createRef, use, useEffect, useState } from "react";
import { recordMic2, startRecording, stopRecording } from "../common/record";

const refFrame = createRef();

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
}

function IsSafari() {
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));

    console.log("IsSafari=" + (isSafari ? "yes": "no") + " user agent=" + navigator.userAgent)

    return isSafari;
}

//var recognition = null
var starting = false;
export default function Mic({recordNotify=null, recognizeNotify=null, completeNotify=null, enable=true, open=false, label=null}) {
    //const [open,    setOpen]    = useState(true);
    const [recorder,setRecorder]= useState(null);
    const [record, setRecord]   = useState(false);
    const [text,   setText]     = useState("");
    const [audio,  setAudio]    = useState(null);
    const [recognition, setRecognition] = useState(null);
    const [listen, setListen]    = useState(false);

    let curAudio = null;
    let recording= false;

    useEffect(() => {
        document.addEventListener("contextmenu", (e) => {e.preventDefault()});
    });
    useEffect(() => {
        if (! recognition) return;
        setListen(enable);
        if (enable) {
            console.log("[webspeech]","@Start recognition.", enable);
            if (!starting) {
                starting = true;
                recognition.start();
            }
        } else {
            console.log("[webspeech]","@Stop recognition.", enable);
            if (starting) {
                starting = false;
                recognition.stop();
            }
        }
    }, [enable]);
    function startWebRecognition(newAudio=null) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        //recognition.lang = "cmn-Hant-TW"; //"zh-TW";
        recognition.lang = "en"; //"zh-TW";
        starting = true;
        recognition.start();
        recognition.onresult = function (event) {
            //const result= event.results[0][0].transcript;
            const final = event.results[0].isFinal;
            var result = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                console.log("[webspeech]", i, event.results[i][0].transcript, event.results[i].isFinal)
                result += event.results[i][0].transcript;
            }
            setText(result);
            if (recognizeNotify && recognition) {
                recognizeNotify(result, curAudio, final);
            }
            if (final && open) {
                console.log("[webspeech]","Stop recognition.");
                if (recognition) recognition.stop();
                console.log("[webspeech]","completeNotify.", text,result);
                if (completeNotify) completeNotify(result, newAudio);
            }
        };
        recognition.addEventListener("audiostart", (event) => {
            console.log("[webspeech]","Audio has been detected.");
        });
        recognition.addEventListener("audioend", (event) => {
            console.log("[webspeech]","Audio stop been detected.");
        });
        recognition.addEventListener("soundstart", (event) => {
            console.log("[webspeech]","Sound has been detected.");
        });
        recognition.addEventListener("soundend", (event) => {
            console.log("[webspeech]","Sound stop been detected.");
        });
        recognition.onend = () => {
            console.log("[webspeech]","Speech recognition has stopped.");
            setTimeout(() => {
                if (listen && open && !starting) {
                    console.log("[webspeech]","Restart recognition.", enable, open);
                    starting = true;
                    recognition.start();
                }
            }, 5000);
        };
        setRecognition(recognition);
    }
    function stopWebRecognition() {
        if(open) return;
        console.log("[webspeech]","Stop recognition.");
        if (recognition) recognition.stop();
        setRecognition(null);
        if (completeNotify) completeNotify(text, audio);
    }
    function stopGoogleRecognition() {
        stopRecording(async (audio, blob, rate) => {
            curAudio=audio
            const data = await blobToBase64(blob);
            console.log("data", data.length)
            const text = await sendHear(data, rate);
            if (recognizeNotify) recognizeNotify(text, audio, true);
            if (completeNotify) completeNotify(text, audio);
        });
    }
    async function sendHear(audio, rate) {
        const res = await fetch("/api/hear", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({audio: audio,rate: rate}),
        });
        const {text} = await res.json();

        return text;
    }
    function enableRecord(callback) {
        recordMic2( (rec) => {
            setRecorder(rec);
            console.log("set recorder", rec);
            startRecording();
        }, 
        async (audio, blob, rate) => {
            curAudio=audio
            const data = await blobToBase64(blob);
            console.log("data", data.length)
            const text = await sendHear(data, rate);
            if (text) setAnimalInput(text);
            if (callback) callback(text);
        });
    }
    function startGoogleRecognition() {
        if (! recorder) {
            enableRecord((text)=>{
                //doConversation(audio, text);
            });
        } else {
            startRecording();
        }
    }
    function startRead() {
        const newAudio = new Audio();
        setAudio(newAudio);
        setRecord(true);
        if (recordNotify)  recordNotify(true);
        const safari = IsSafari();
        if (safari)
            startGoogleRecognition();
        else
            startWebRecognition(newAudio);
        console.log("recognition", recognition)
    }
    async function stopRead() {
        console.log("recognition", recognition)
        if (! record) return;
        
        const safari = IsSafari();
        if (!open) setRecord(false);
        if (recordNotify)  recordNotify(false);
        if (safari)
            stopGoogleRecognition();
        else
            stopWebRecognition();
    }
    return (
            <div className={styles.voice} 
                onMouseDown={startRead}
                onTouchStart={startRead} 
                onMouseUp={stopRead}
                onTouchEnd={stopRead}
                disabled={! enable}> 
                {
                    (record)
                    ? (label) ? <button className={styles.record}>{label}</button>: <img className={styles.icon} src={"record.svg"} width={"40px"} height={"40px"}/>
                    : (label) ? <button className={styles.speak}>{label}</button>: <img className={styles.icon} src={"microphone.svg"} width={"40px"} height={"40px"}/>
                }
                <div className={styles.cover}></div>
            </div>
        )
}
