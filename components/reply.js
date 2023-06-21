import styles from "./conversation.module.css";
import { createRef, useEffect, useState } from "react";

const refResult     = createRef();

export default function Reply({result, saying}) {
    useEffect(()=>{
        const elmPage = refResult.current;
        if (elmPage) {
            elmPage.scrollTop = elmPage.scrollHeight;
        }
    }, [saying, result])
    return (
            <div ref={refResult} className={styles.result}>
                {
                    (saying)
                    ? <div className={styles.replytext}>{saying}</div>
                    : <div className={styles.replytext}>
                        {(result.length>0)?result[result.length-1].text:""}
                    </div>
                }
            </div>
        )
}
