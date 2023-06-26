import { createRef, useEffect, useState } from "react";
import styles from "./chat.module.css";
import {progress_start, progress_end} from "../common/progress"
import { CONTEXT_COFFEE, CONTEXT_PACIFIC, TITLE_COFFEE, TITLE_PACIFIC, CONTEXT_MAC, TITLE_MAC, CONTEXT_GAME } from "../common/context"
// UI
import ContextBar from "../components/contextbar";
import TitleBar from "../components/titlebar";
import Menu from "../components/menu";
import Order from "../components/order";
import ActionBar from "../components/actionbar";
// Avatar
import Avatar from "../components/avatar";
// Conversation
import Conversation from "../components/conversation";
import { processConversation, workConversaction, resetConversation } from "../common/conversation";
import { apiTTS2 } from "../common/tts";
// Mic
import Mic from "../components/micpure";
// RTC
import { createConnection, JoinRoom, ListRoom, CloseRoom} from "../common/serverapi";
import { OnPair, OnRTC, rtcConnectPeer, rtcDisconnectPeer, createRemoteVideo} from "../common/rtc";
import { startVideo } from "../common/camcorder";
import Reply from "../components/reply";

const refPlayer = createRef();
const refUpload = createRef();
const refCloner = createRef();

const testtext = "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
const colmap = [ styles.single, styles.colsGame, styles.cols3 ];

var myRoom  = "none";

const defaultVoices = [
    {name: "F0001"},
    {name: "F0002"},
]
export default function Home({mode, cols, header, cport}) {
    //const [header, setHeader]   = useState(test && mode != "mac");   // && mode != "mac")
    const [animalInput, setAnimalInput] = useState("");
    const [result, setResult]   = useState([]);
    const [enable, setEnable]   = useState(true);
    const [tlist,  setTlist]    = useState(null);
    const [id,     setId]       = useState(null);
    const [title,  setTitle]    = useState("");
    const [prefix, setPrefix]   = useState(CONTEXT_PACIFIC);
    const [saying, setSaying]   = useState(null)
    const [index,  setIndex]    = useState(0)
    const [record, setRecord]   = useState(false)
    const [order,  setOrder]    = useState(null);
    const [menu,   setMenu]     = useState(null);
    const [rtcsdk, setRtcSDK]   = useState(null);
//  Avatar
    const [light,  setLight]    = useState(false);
    const [action, setAction]   = useState("still");
    const [model,  setModel]    = useState("caa-avatar2.vrm"); //hemo-2.vrm , demo-5.vrm
    const [speak,  setSpeak]    = useState(false);
//  Mode
    const [open,   setOpen]     = useState(false);
    const [sample, setSample]   = useState(null);
    const [player, setPlayer]   = useState(null);
    const [testmsg,setTestMsg]  = useState("This is test message from your cloned voice");
    const [tab,    setTab]      = useState("clone");
    const [name,   setName]     = useState("");
    const [voices, setVoices]   = useState(defaultVoices);

//  Clone
    const [target, setTarget]   = useState(defaultVoices[0]);

    useEffect(() => {
        //var url = new URL(window.location);
        //url.port = '';
        //console.log(url, url.toString());
        setPrefix(CONTEXT_GAME);
        setTitle(TITLE_MAC);
    })
    const bind = {
        result: [result, setResult],
        saying: [saying, setSaying],
        enable: [enable, setEnable],
        action: [action, setAction],
         speak: [speak,  setSpeak],
          menu: [menu,   setMenu]
    }
    function onRecognized(text, audio, isFinal) {
        if (text) setAnimalInput(text);
    }
    function playAudio() {
        player.play();
    }
    function getCloneServer() {
        const url = new URL(window.location);
        url.port = cport;
        url.pathname = '/messages';
        url.search = '';
        return url.toString();
    }
    function addClone() {
        if (name == "") {
            alert("Please input voice name");
            return;
        }
        if (sample == null) {
            alert("Please record or upload voice");
            return;
        }
        const list = voices;
        list.push({name: name, sample: sample});

        setVoices(list);
    }
    function testClone() {
        var audio = new Audio();

        const head = "data:audio/wav;base64,"
        //const data = refPlayer.current.src.slice(head.length);
        const data = (target.sample) ? target.sample.slice(head.length): null;
        const load = (data != null)
                     ? { message: testmsg, speaker: target.name, wav: data }
                     : { message: testmsg, speaker: target.name };
        const option = {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json', 'Accept':'application/json' },
            body: JSON.stringify( load )
        }

        //const api = "http://localhost:5000/messages";
        const api = getCloneServer();
        fetch(api, option)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const contentType = 'audio/mpeg';
            const audio = refCloner.current;
            audio.src = `data:${contentType};base64,${data.raw}`;
            audio.play();
        });
    }
    function onMessageChange(event) {
        setTestMsg(event.target.value);
    }
    function onFileChange(event) {
        const audio = new Audio();
        const fileList = event.target.files;
        const file = fileList[0];
        //console.log(fileList);
        alert(file.name);
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            //img.src = event.target.result;
            const data = event.target.result;

            setPlayer(refPlayer.current);
            setSample(data);
            
            refPlayer.current.src = data;
            refPlayer.current.play();
        });
        reader.readAsDataURL(file);
    }
    function onComplete(data, audio) {
        //doConversation(audio, text);
        console.log("onComplete", data)
        if (refPlayer.current == null) return;

        setPlayer(refPlayer.current);
        setSample(data);
        console.log("onComplete", data)
        refPlayer.current.src = data;
        refPlayer.current.play();
    }
    function onTargetChanged(event) {
        const index = event.target.value;
        setTarget(voices[index]);
        console.log("onTargetChanged", index);
    }
    function setOpenMode() {
        setOpen(!open);
    }
    function onTabClone() {
        setTab("clone");
    }
    function onTabTest() {
        setTab("test");
    }
    function onNameChange(event) {
        setName(event.target.value);
    }
    return (
        <div className={styles.frame}>
        <div className={styles.threeback}>
            {/*<img src="tile.png" width={"100%"} height={"100%"}/>*/}
        </div>
        <div className={styles.innerGame}>
            {
            (header)
            ?   <></>
            :   <div>
                    <TitleBar back={(mode != "mac" && mode !="chat")} 
                                title={title} record={record}
                                open={open}
                                callback={setOpenMode}/>
                    {(myRoom != "none" && myRoom != "?")? <span>店 {myRoom}</span>: <></>}
                </div>
            }
            <div className={colmap[cols]}>
                <div className={styles.threeframe}>
                    <div className={styles.sideback}></div>
                    <div className={styles.sidebar}>
                        <div className={styles.baritem}>Text to Speach</div>
                        <hr/>
                        <div className={styles.itemlist}>
                            <div className={styles.baritem} onClick={onTabClone}>
                                Voice Clone
                            </div>
                            <div className={styles.baritem} onClick={onTabTest}>
                                Voice Test
                            </div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
                
                <div>
                    {
                    (tab == "test")
                    ? <div className={styles.testframe}>
                        <div className={styles.testarea}>
                            <div>
                                <span>Select speaker:  </span>
                                <select onChange={onTargetChanged}>
                                {
                                voices.map((voice, index) => <option key={index} value={index}>{voice.name}</option>)
                                }
                                </select>
                            </div>
                            <div>
                                <span>Input text:  </span>
                                <div>
                                    <textarea value={testmsg} onChange={onMessageChange} rows="10" cols="50"/>
                                </div>
                                <div>
                                <button onClick={testClone}>Test</button>
                                </div>
                                <div>
                                    <audio ref={refCloner} className={styles.player} controls></audio>
                                </div>
                            </div>
                            {/*}
                            <main className={styles.main}>
                                <Reply result={result} saying={saying}/>
                            </main>
                            */}
                        </div>
                    </div>
                    : <></>
                    }
                    {
                    (tab == "clone")
                    ? <div className={styles.clonetab}>
                        <div>
                            <div className={styles.userlabel}>Add your cloning</div>
                            <div>
                            Name: <input type="text" value={name} onChange={onNameChange}/>
                            <button onClick={addClone}>Clone</button>
                            </div>
                        </div>
                        <hr/>
                        <div className={styles.cloneitem}>
                            <div className={styles.userlabel}>Record</div>
                            <div>
                            {testtext}
                            </div>
                            <div className={styles.userinput}>
                                {/*<button onClick={playAudio}>Play</button>*/}
                                <div className={styles.micframe}>
                                    <div className={styles.micinner}>
                                        <Mic recordNotify={setRecord}
                                            recognizeNotify={onRecognized}
                                            completeNotify={onComplete}
                                            enable={enable}
                                            open={open}/>
                                    </div>
                                </div>
                                <audio ref={refPlayer} className={styles.player} controls></audio>
                            </div>
                        </div>
                        <div className={styles.cloneitem}>
                            <div className={styles.userlabel}>Upload</div>
                            <input type="file" accept="audio/wav" capture="microphone" onChange={onFileChange}/>
                            <audio ref={refUpload} className={styles.player} controls></audio>   
                        </div>
                    </div>
                    : <></>
                    }   
                </div>
            </div>
        </div>
        </div>
    );
}

export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
    const login = true; //req.cookies.token;
    const target= {destination: '/login', permanent: false}
    const mode  = (query["mode"])? (query["mode"]): null;
    const cols  = 1; //(test)? ( is711 ? ((role=="master")? 2: 0): 1): 0;
    const header = true;   //test && mode != "mac";
    const cport = process.env.CPORT;
    
    if (login) {
        return { props: {mode, cols, header, cport} }
    } else {
        return { redirect: target}
    }
}
