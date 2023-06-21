import styles from "./titlebar.module.css";
import { createRef } from "react";

const refCounter    = createRef();

export default function TitleBar({back, title, record, open=false, callback=null}) {
    async function onBack() {
        window.location.href = "/";
    }
    function Go(url) {
        window.location.href = "/" + url;
    }
    return (
            <div className={styles.titlebar} onClick={(callback)?callback:()=>0}>
                <div className={styles.back} onClick={onBack}>
                    {(back)? <img src="back.svg"/>: <div></div>}
                </div>
                <div>
                    <span className={(record)?styles.rtitle:styles.title}>{
                        (title)? ((open)? title: "["+title+"]"): ""}
                    </span>
                    <span ref={refCounter}></span>
                </div>
                <div className={styles.cover}></div>
            </div>
        )
}
