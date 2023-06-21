import Cookies from 'universal-cookie';
import { GoogleLogin } from '@react-oauth/google';
import styles from "./list.module.css";
import { useState, useEffect } from 'react';
import { CONTEXT_COFFEE, CONTEXT_PACIFIC, TITLE_COFFEE, TITLE_PACIFIC } from "../common/context"
import FootBar from '../components/footbar';

export default function Home({test}) {
    async function onBack() {
        window.location.href = "/";
    }
    return (
        <>
        <div className={styles.frameN}>
            <div>
                <img className={styles.image} src="profile.svg"/>
            </div>
            <FootBar Current="profile"/>
        </div>
    </>)
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
