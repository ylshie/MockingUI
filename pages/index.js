import Cookies from 'universal-cookie';
import { GoogleLogin } from '@react-oauth/google';
import styles from "./login.module.css";

const cookies = new Cookies();
const setAuthToken = (token) => {
    const option = { path: '/', secure: true, sameSite: true};
    cookies.set('token', token, option);
};

const removeAuthToken = () => {
    if (cookies.get('token')===undefined){
        return null;
    }
    return cookies.remove('token');
  };

export default function Home({mimo}) {
    function Clear() {
        removeAuthToken();
    }
    function Login() {
        setAuthToken("1111")
        window.location.href = "/message"
    }
    return (
        <div className={styles.frame}>
            <div>
                <div className={styles.logo}>
                    <img src={(mimo) ? "mimo.png":"./newave.svg"} width={"68px"} height={"68px"}/>
                </div>
                <div className={styles.title} onClick={Clear}>
                Sign in
                </div>
                <div className={styles.input}>
                    <img src={"./username.svg"}/>
                    <div className={styles.divtext}>
                        <input type="text"></input>
                    </div>
                </div>
                <div className={styles.password}>
                    <img src={"./password.svg"}/>
                    <div className={styles.divtext}>
                        <input type="text"></input>
                    </div>
                </div>
                    <div className={styles.remember}><img src={"./rememer.svg"}/></div>
                    <div className={styles.forgot}><img src={"./forgot.svg"}/></div>
                <div className={styles.signin} onClick={Login}>
                    <img src={"./login.svg"}/>
                </div>
                <div className={styles.or}>
                    OR
                </div>
                <div className={styles.google} onClick={Login}>
                    <img src={"./google.svg"}/>
                </div>
                <div className={styles.facebook} onClick={Login}>
                    <img src={"./facebook.svg"}/>
                </div>
            </div>
        </div>
    )
}

function redirect(site) {
    if (site == "chat") return "/chat?mode=chat"
    if (site == "game") return "/game?mode=game"
    if (site == "train") return "/train?mode=game"

    return "/chat?mode=mac"
}

export async function getServerSideProps({params,req,res,query,preview,previewData,resolvedUrl,locale,locales,defaultLocale}) {
    const mimo  = (process.env.SITE == "mimo")
    const mac   = (process.env.SITE == "mac")
    const is711 = (process.env.SITE == "711")
    const chat  = (process.env.SITE == "chat")
    const game  = (process.env.SITE == "game")
    const train = (process.env.SITE == "train")
    const target= {destination: redirect(process.env.SITE), permanent: false}
    
    if (chat || mac || is711 || game || train) {
        return { redirect: target}
    } else {
        return { props: {mimo} }
    }
}

