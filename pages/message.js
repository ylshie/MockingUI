import Cookies from 'universal-cookie';
import { GoogleLogin } from '@react-oauth/google';
import styles from "./list.module.css";
import { useState, useEffect } from 'react';
import { CONTEXT_COFFEE, CONTEXT_PACIFIC, TITLE_COFFEE, TITLE_PACIFIC } from "../common/context"
import FootBar from '../components/footbar';

const nameTA    = "TA需求";
const nameNews  = "更多資訊"
export default function Home({test,mimo}) {
    const [tlist,  setTlist]    = useState(null);
    const [first,  setFirst]    = useState((mimo)? 2: 0);
    const [second, setSecond]   = useState((mimo)? 0: 1);
    const [third,  setThird]    = useState((mimo)? 1: 2);
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
            console.log("list", data)
            setTlist(data);
        }
    }
    useEffect(() => {
        if (tlist == null) {
            fillList();
        } 
    })
    async function onClickItem(index) {
        if (! tlist) return;

        const item = tlist[index];
        console.log("item", index, tlist[index])
        window.location.href = "/chat?id=" + item._id;
    }
    async function onBack() {
        window.location.href = "/";
    }
    async function onTA(name) {
        window.location.href = "/more?name=" + name + "&path=ta";
    }
    async function onNews(name) {
        window.location.href = "/more?name=" + name + "&path=news";
    }
    return (
        <>
        <div className={styles.frame}>
            <div className={styles.inner}>
                <div className={styles.titlebar}>
                    <div className={styles.back} onClick={onBack}>
                        <img src="back.svg"/>
                    </div>
                    <div className={styles.title}>
                        Message
                    </div>
                </div>
                <div className={styles.itemframe}>
                    <div className={styles.item} onClick={() => onClickItem(first)}>
                        <div className={styles.itemlabel}>{(tlist)? tlist[first].name: ""}</div>
                        <img src="itemgpt.svg"/>
                    </div>
                    <hr/>
                    <div className={styles.item} onClick={() => onClickItem(second)}>
                        <div className={styles.itemlabel}>{(tlist)? tlist[second].name: ""}</div>
                        <img src="itemmc.svg"/>
                    </div>
                    <hr/>
                    <div className={styles.item} onClick={() => onClickItem(third)}>
                        <div className={styles.itemlabel}>{(tlist)? tlist[third].name: ""}</div>
                        <img src="itemdv.svg"/>
                    </div>
                    {(!mimo)? <hr/>: <></>}
                    {
                        (!mimo)
                        ? <div className={styles.item} onClick={() => onTA(nameTA)}>
                            <div className={styles.itemlabel}>{nameTA}</div>
                            <img src="itemgpt.svg"/>
                        </div>
                        :<></>
                    }
                    {(!mimo)? <hr/>: <></>}
                    {
                        (!mimo)
                        ? <div className={styles.item} onClick={() => onNews(nameNews)}>
                            <div className={styles.itemlabel}>{nameNews}</div>
                            <img src="itemgpt.svg"/>
                        </div>
                        : <></>
                    }
                </div>
                <FootBar Current="message"/>
            </div>
        </div>
        </>)
}

export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
    const test  = (process.env.MODE != "public")
    const mimo  = (process.env.SITE == "mimo")
    const login = req.cookies.token;
    const target= {destination: '/login', permanent: false}
    
    if (login) {
        return { props: {test, mimo} }
    } else {
        return { redirect: target}
    }
}
