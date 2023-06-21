import { useState, useEffect } from "react";
import styles from "./addcontext.module.css";

export default function Home({info}) {
    const [id,   setId]     = useState(info.id);
    const [name, setName]   = useState(info.name);
    const [text, setText]   = useState(info.text);
    const [mode, setMode]   = useState(info.mode);

    console.log("info", info);
    async function onNameChanged(event) {
        setName(event.target.value);
    }
    async function onTextChanged(event) {
        setText(event.target.value);
    }
    async function addContext() {
        const response = await fetch("/api/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: name, text: text}),
        });
        window.location.href = "/"
    }
    async function saveContext() {
        const response = await fetch("/api/save", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id, name: name, text: text}),
        });
        window.location.href = "/"
    }
    async function cancel() {
        //window.location.href = "/"
        history.back()
    }

    useEffect(() => {
        /*
        if (info) {
            if (info.mode) setMode(info.mode);
            if (info.id)   setId(info.id);
            if (info.name) setName(info.name);
            if (info.text) setText(info.text);
        }
        */
    })

    return (
        <div className={styles.group}>
            <div className={styles.main}>
                <div>
                    Usage:<br/>
                    設定對話的場景, 應該要包含下面的訊息在裡面.
                    <ul>
                        <li>Bot的資訊: 名字跟在場景中的角色</li>
                        <li>場所的資訊: 場所的種類和提供的服務或功能</li>
                        <li>互動的資訊: 互動時候需要的細節以及限制</li>
                    </ul>
                </div>
                <div>
                    Example:<br/>
                    妳的名字是 Himeno, 咖啡店的招待 
                    這裡是 tomato 咖啡店, 咖啡店提供早餐, 午餐和下午茶·
                    早餐到 11 點, 可以點一杯飲料, 我們會送一片厚片吐司還可以搭配各個套餐.
                    A 餐是加一顆水煮蛋, B餐是加一個雞蛋沙拉, C餐是加一個紅豆泥.
                    如果還要額外加點的話, 加一個早餐吐司是 NT40, 加水煮蛋是 NT20, 加雞蛋沙拉是 NT20, 加紅豆泥是 NT20.
                    飲料有下面幾種,
                    美式咖啡 NT105, 特調咖啡 NT135, 維也納咖啡 NT135.
                    User 問的時候, 先簡單的介紹早餐的點法, 然後再詢問 user 要什麼
                </div>
            </div>
            <div className={styles.main}>
                <div>
                    <label>Name:</label>
                    <input className={styles.name} type="text" onChange={onNameChanged} defaultValue={name}/>
                </div>
                <div>
                    <div>
                        <label>Text:</label>
                    </div>
                    <div>
                        <textarea className={styles.text} type="text" rows="20"
                                  onChange={onTextChanged} defaultValue={text}></textarea>
                    </div>
                    <div>
                        { (mode == "edit")
                          ? <button onClick={saveContext}>Save</button>
                          : <button onClick={addContext}>Add</button>
                        }
                        <button onClick={cancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
    console.log("query=", query)
    console.log(req.method, req.body);
    
    let body = '';
    req.setEncoding('utf-8');
    for await (const chunk of req) {
        body += chunk;
    }
    body = "http://dummpy?" + body;
    console.log("body", body);
    console.log("completed");
    const parsedURL = new URL(body)
    console.log(parsedURL.searchParams);
    
    const id    = parsedURL.searchParams.get('id');
    const mode  = parsedURL.searchParams.get('mode');
    const name  = parsedURL.searchParams.get('name');
    const text  = parsedURL.searchParams.get('text');

    const info = {};
    if (mode)   info.mode   = mode;
    if (id)     info.id     = id;
    if (name)   info.name   = name;
    if (text)   info.text   = text;

    return { props: { info } }
}
