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
import Mic from "../components/mic";
// RTC
import { createConnection, JoinRoom, ListRoom, CloseRoom} from "../common/serverapi";
import { OnPair, OnRTC, rtcConnectPeer, rtcDisconnectPeer, createRemoteVideo} from "../common/rtc";
import { startVideo } from "../common/camcorder";
import Reply from "../components/reply";

const refCounter    = createRef();
const refLocal      = createRef();
const refRemote     = createRef();
const refResult     = createRef();

const colmap = [ styles.single, styles.colsGame, styles.cols3 ];
const useSecure = true;
const useGoogle = true;
const local     = "localhost"
const google    = "www.2boxify.com" //"34.81.174.90"
const host      = (useGoogle)? google: local
const urlWS     = "ws:" + '//'  + host + ":1337";
const urlWSS    = "wss:" + '//' + host + ":1338";
const urlH      = "http://"  + host + ":3000";
const urlS      = "https://" + host + ":3001";
const wurl      = (useSecure)? urlWSS: urlWS;
const url       = (useSecure)? urlS: urlH;

var myRoom  = "none";
var myRole  = "none";
var myName  = false;
var connection = null;

function connectPeer(camcorder) {
    if (myRoom == "none") console.log("myRoom not set");
    if (myRole == "none") console.log("myRole not set");
    if (myName == false) console.log("myName not set");
    if (connection == null) console.log("connection not set");

    const local     = camcorder;    
    const remote    = document.getElementById('remoteVideo');

    rtcConnectPeer(myRoom, myRole, myName, connection, local, remote)
}

var first = true;
let localVideo = null;

export async function masterConnect() {
    if (! localVideo) return;
    if (myRole != "master") return;
    if (myRoom == "none") return;

    connectPeer(localVideo);
}

export function closeCamcoder() {
    if (! localVideo) {
        console.log("closeCamcoder", "localVideo should not be null");
        return;
    }
    const stream = localVideo.srcObject;
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') track.stop();
    });
    localVideo = null;
}

function startSDK() {
    startVideo(refLocal.current).then((video)=>{
        if (first) {
            first = false;
            if (refRemote.current) {
                createRemoteVideo(refRemote.current);
            } else {
                console.log("refRemote not ready");
            }
            localVideo = video;
            //if (myRole == "slave") connectPeer(video);
            connectPeer(video);
        }
    })
}

function remoteCommand(action, data) {
    const json   = {  type: "avcmd", 
                      room: myRoom, 
                      role: myRole, 
                      name: myName, 
                    action: action,
                      data: data};
    connection.send(JSON.stringify(json));
}
function OnAvatar(json) {
    if (myRole == "slave" && myRoom != "none" && connection) {
    //    renderVRM(json.data);
    }
}
function OnOpen() {
}

function OnError(error) {
}

export default function Home({test, mode, srcid, role, is711, cols, header, actionbar, dospeak}) {
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
    //const [model,  setModel]    = useState("cc4qq2.vrm"); //hemo-2.vrm , demo-5.vrm
    const [speak,  setSpeak]    = useState(false);
//  Room list
    const [rooms,  setRooms]    = useState(null);
    const [showQA, setShowQA]   = useState(false);
    const [showCS, setShowCS]   = useState(false);
//  Mode
    const [open,   setOpen]     = useState(false);

    function onCustomService(event) {
        if (! rtcsdk && is711) {
            const sdk = StartRTC(role);
            setRtcSDK(sdk)
        }
        setShowCS(true);
    }
    useEffect(() => {
        if (is711 && role == "master") {
            if (! rtcsdk) {
                setRtcSDK(StartRTC(role))
            }
        } 
        
        if (tlist == null) {
            fillList();
        } else if (mode == "mac") {
            setPrefix(CONTEXT_MAC);
            setTitle((is711)? "7-11": TITLE_MAC);
        } else if (mode == "game") {
            setPrefix(CONTEXT_GAME);
            setTitle(TITLE_MAC);
        } else if (mode == "chat") {
            setPrefix("妳的名字是 himeno, 是聊天服務員, 跟客戶聊天, 回答客戶的問題");
            setTitle("聊天室");
        } else {
            if (tlist.length) {
                setId(tlist[index]._id);
                setTitle(tlist[index].name);
                if (test) {
                    setPrefix(tlist[index].text);
                } else {
                    //setPrefix(CONTEXT_PACIFIC);
                    for (let i=0; i < tlist.length; i++) {
                        if (tlist[i]._id == srcid) {
                            console.log("found");
                            setPrefix(tlist[i].text);
                            setId(tlist[i]._id);
                            setTitle(tlist[i].name);
                        }
                    }
                }
            }
        }
    })
    function masterJoinRoom(roomId) {
        JoinRoom(url, roomId, myRole, (data) => {
            myName = data.name;
            myRoom = data.room;
            console.log("JoinRoom", data);
            if (data.status == "ok") {
                connection.send(JSON.stringify({type: "connect", room: myRoom, role: myRole, name: myName}));
                startSDK();
            } else {
                alert("occupied")
            }
        })
    }
    function OnRoom(json) {
        ListRoom(url, (ret) => {
            console.log("ListRoom", ret, json);
            setRooms(ret.data);
            if (json.extra && json.extra.action == "close") {
                if (role == "master") window.location.reload();
            }
        });
    }
    function StartRTC(role) {
        const master = (role == "master")
        myRoom = "?";
        myRole = (master)? "master": "slave";
    
        var handlerMsg = {
            avatar: OnAvatar,
             avcmd: OnAVCmd,
              room: OnRoom,
              pair: OnPair,
               rtc: OnRTC,
        }
        
        connection = createConnection(wurl, () => {
            console.log("createConnection success");
            if (master) {
                OnRoom({});
            } else {
                masterJoinRoom("?");
            }
        }, () => {
            console.log("createConnection failed");
        }, handlerMsg);
        console.log(connection);
    
        return "ok";
    }
    function OnAVCmd(json) {
        console.log("OnAVCmd", json);
        if (json.action == "action") {
            setAction(json.data);
        } else if (json.action == "avatar") {
            setModel(json.data)
        } else if (json.action == "voice") {
            const audio = new Audio();
            apiTTS2("avcmd", json.data, audio, setSpeak);
        }
    }
    async function fillList() {
        const response = await fetch("/api/list", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({}),
        });
        const data  = await response.json();

        if (data.length == 0) {
            const response = await fetch("/api/add", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name: TITLE_COFFEE, text: CONTEXT_COFFEE}),
            });
            console.log("add context", response)
        } else {
            setTlist(data);
        }
    }
    function onConversation(event) {
        if (is711) {
            remoteCommand("voice",animalInput)
            setAnimalInput(null);
        } else {
            const audio = new Audio();
            const text  = animalInput;
            setAnimalInput("");
            doConversation(audio, text);
        }
    }
    const bind = {
        result: [result, setResult],
        saying: [saying, setSaying],
        enable: [enable, setEnable],
        action: [action, setAction],
         speak: [speak,  setSpeak],
          menu: [menu,   setMenu]
    }
    async function doConversation(audio, text) {
        workConversaction(audio, prefix, text, bind)
    }
    /*
    function onRecognized(text, audio) {
        if (text) setAnimalInput(text);
        if (is711) {
            remoteCommand("voice",text)
            setTimeout(()=> setAnimalInput(null), 2000);
        } else {
            doConversation(audio, text);
        }
    }
    */
    function onRecognized(text, audio, isFinal) {
        if (text) setAnimalInput(text);
        /*
        if (isFinal) {
          setTimeout(() => setInput(""), 10000);
          //doConversation(audio, text);
        }
        */
    }
    function onComplete(text, audio) {
        setTimeout(() => {
            setAnimalInput("")
            console.log("[webspeech]","reset prompt")
        }, 10000);
        if (is711) {
            remoteCommand("voice",text)
        } else {
            doConversation(audio, text);
        }
    }
    function doAction(name) {
        if (is711) {
            remoteCommand("action",name);
        } else {
            setAction(name);
        }
    }
    async function onModelChange(event) {
        const path = event.target.value;

        if (is711) {
            remoteCommand("avatar",path)
        } else {
            setModel(path);
        }
    }
    function OnSelect(index, item) {
        if (item) {
            setIndex(index);
            setId(item._id);
            setTitle(item.name)
            setPrefix(item.text);
        }
        resetConversation()
        setResult([])
    }
    function selectRoom(room) {
        masterJoinRoom(room);
        alert(room);
    }
    function OnCloseCS() {
        const remote    = document.getElementById('remoteVideo');
        CloseRoom(url, myRoom, myRole, (data) => {
            console.log("CloseRoom", data);

            if (connection != null) {
                connection.close();
                connection = null;
            }
        });
        closeCamcoder();
        setRtcSDK(null);
        remote.srcObject = null;
        first = true;
        setShowCS(false);
    }
    function setOpenMode() {
        setOpen(!open);
    }
    return (
        <div className={styles.frame}>
        <div className={styles.threeback}>
            <img src="cafe.png" width={"100%"} height={"100%"}/>
        </div>
        <div className={(is711)? styles.inner711: styles.innerGame}>
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
                    <Avatar file={model} action={action} speak={speak} pose={1} light={light}/>
                    { (menu != null && order == null && mode=="mac") ? <Menu menu={menu}/>: <></> }
                    { (order != null) ? <Order orders={order}/>: <></> }
                    {
                    (actionbar)
                    ? <ActionBar  doModel={onModelChange} doAction={doAction}/>
                    : <div></div>
                    }
                </div>
                
                <div className={styles.convesation}>
                    <div className={styles.chatbotbbuilder}>
                        CHAT BOT BUILDER
                    </div>
                    {/*<ContextBar tlist={tlist} onChanged={OnSelect}/>*/}
                    <div></div>
                    <div className={styles.botframe}>
                        <div className={styles.botarea}>
                            <div className={styles.botlabel}>Bot</div>
                            <main className={styles.main}>
                                <Reply result={result} saying={saying}/>
                            </main>
                        </div>
                    </div>
                    <div className={styles.userarea}>
                        <div className={styles.userlabel}>User</div>
                        <div className={styles.userinput}>
                            <input  className={styles.userprompt}
                                    placeholder="Place your question"
                                    value={animalInput}
                                    onChange={(e) => setAnimalInput(e.target.value)}
                                    onKeyDown={(e) => (e.keyCode == 13)? onConversation(e):"" }
                                    disabled={! enable}
                                />
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
    const parsedURL = new URL(req.url, `http://${req.headers.host}`)
    const is711 = (process.env.SITE == "711")
    const is911 = (req.headers.host.indexOf("911") != -1);
    const test  = (process.env.MODE != "public")
    const login = true; //req.cookies.token;
    const target= {destination: '/login', permanent: false}
    console.log(query);
    const qid   = (query["id"])?   (query["id"]):   null;
    const mode  = (query["mode"])? (query["mode"]): null;
    const qrole = (query["role"])? (query["role"]): "slave";
    const role  = (is911)? "master": qrole;
    const srcid = (mode == "mac")? 1: qid;
    const dospeak = test;
    // Layout
    const cols  = 1; //(test)? ( is711 ? ((role=="master")? 2: 0): 1): 0;
    const header = true;   //test && mode != "mac";
    const actionbar = false;    //! is711;
    
    if (login) {
        return { props: {test, srcid, mode, role, is711, cols, header, actionbar, dospeak} }
    } else {
        return { redirect: target}
    }
}
