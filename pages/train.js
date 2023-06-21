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
const refCloner = createRef();

const colmap = [ styles.single, styles.colsGame, styles.cols3 ];

var myRoom  = "none";

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
    function testClone() {
        var audio = new Audio();

        const head = "data:audio/wav;base64,"
        const data = refPlayer.current.src.slice(head.length);
        const load = (testmsg)
                     ? { message: testmsg, speaker: "F0001", wav: data }
                     : { message: testmsg, speaker: "F0001" };
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
    function setOpenMode() {
        setOpen(!open);
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
                {/*
                    <Avatar file={model} action={action} speak={speak} pose={1} light={light}/>
                    { (menu != null && order == null && mode=="mac") ? <Menu menu={menu}/>: <></> }
                    { (order != null) ? <Order orders={order}/>: <></> }
                    {
                    (actionbar)
                    ? <ActionBar  doModel={onModelChange} doAction={doAction}/>
                    : <div></div>
                    }
                */}
                </div>
                
                <div className={styles.convesation}>
                    <div className={styles.chatbotbbuilder}>
                        CLONE YOUR VOICE
                    </div>
                    {/*<ContextBar tlist={tlist} onChanged={OnSelect}/>*/}
                    <div></div>
                    <div></div>
                    <div className={styles.botframe}>
                        <div className={styles.botarea}>
                            <div className={styles.botlabel}>Clone Test</div>
                            <div>
                                <div>
                                    <input type="text" value={testmsg} onChange={onMessageChange}/>
                                </div>
                                <div>
                                    <audio ref={refCloner} className={styles.player} controls></audio>
                                    <button onClick={testClone}>Clone</button>
                                </div>
                            </div>
                            {/*}
                            <main className={styles.main}>
                                <Reply result={result} saying={saying}/>
                            </main>
                            */}
                        </div>
                    </div>
                    <div className={styles.userarea}>
                        <div className={styles.userlabel}>Record your voice</div>
                        <div className={styles.userinput}>
                            {/*<button onClick={playAudio}>Play</button>*/}
                            <audio ref={refPlayer} className={styles.player} controls></audio>
                            <div className={styles.micframe}>
                                <div className={styles.micinner}>
                                    <Mic recordNotify={setRecord}
                                        recognizeNotify={onRecognized}
                                        completeNotify={onComplete}
                                        enable={enable}
                                        open={open}/>
                                </div>
                            </div>
                        </div>
                    </div>

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
