import Cookies from 'universal-cookie';
import { GoogleLogin } from '@react-oauth/google';
import styles from "./list.module.css";
import { useState, useEffect } from 'react';
import { CONTEXT_COFFEE, CONTEXT_PACIFIC, TITLE_COFFEE, TITLE_PACIFIC } from "../common/context"
import FootBar from '../components/footbar';

export default function Home({name, path}) {
    async function onBack() {
        history.back();
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
                        {name}
                    </div>
                </div>
                <div>
                    <img className={styles.imageX} src={path}/>
                </div>
            </div>
        </div>
    </>)
}

export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
    const test  = (process.env.MODE != "public")
    const login = req.cookies.token;
    const target= {destination: '/login', permanent: false}
    const path = query["path"] + ".jpg"
    const name = query["name"]
    
    if (login) {
        return { props: {name, path} }
    } else {
        return { redirect: target}
    }
}
