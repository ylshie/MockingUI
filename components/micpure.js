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

var starting = false;
export default function Mic({recordNotify=null, recognizeNotify=null, completeNotify=null, enable=true, open=false, label=null}) {
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
            //const text = await sendHear(data, rate);
            //if (text) setAnimalInput(text);
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
    function stopGoogleRecognition() {
        stopRecording(async (audio, blob, rate) => {
            curAudio=audio
            const data = await blobToBase64(blob);
            console.log("data", data.length)
            //const text = await sendHear(data, rate);
            if (recognizeNotify) recognizeNotify(data, audio, true);
            if (completeNotify) completeNotify(data, audio);
        });
    }
    function startRead() {
        const newAudio = new Audio();
        setAudio(newAudio);
        setRecord(true);
        if (recordNotify)  recordNotify(true);
        //const safari = IsSafari();
        //if (safari)
        startGoogleRecognition();
        //else
        //    startWebRecognition(newAudio);
        console.log("recognition", recognition)
    }
    async function stopRead() {
        console.log("recognition", recognition)
        if (! record) return;
        
        //const safari = IsSafari();
        if (!open) setRecord(false);
        if (recordNotify)  recordNotify(false);
        //if (safari)
        stopGoogleRecognition();
        //else
        //    stopWebRecognition();
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
