import Cookies from 'universal-cookie';
import { GoogleLogin } from '@react-oauth/google';
import styles from "./list.module.css";
import { useState, useEffect } from 'react';
import { CONTEXT_COFFEE, CONTEXT_PACIFIC, TITLE_COFFEE, TITLE_PACIFIC } from "../common/context"

export default function Home({test}) {
    const [tlist,  setTlist]    = useState(null);
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
    return (<div className={styles.frame}>
    <div className={styles.title}>
        Message
    </div>
    <div className={styles.search}>
        <img src={"./search.svg"}/>
    </div>
    <div className={styles.itemframe}>
        {
            (tlist) 
            ? tlist.map((item, index) => {
                return  <>
                            <div className={styles.item} key={index} value={index} onClick={() => onClickItem(index)}>
                                {item.name}
                            </div>
                            <hr/>
                        </>
            })
            : <></>
        }
    </div>
    </div>)
}

export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
    const test  = (process.env.MODE != "public")
    const login = req.cookies.token;
    const target= {destination: '/login', permanent: false}
    
    if (login) {
        return { props: {test} }
    } else {
        return { redirect: target}
    }
}
