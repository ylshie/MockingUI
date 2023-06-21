import styles from "./conversation.module.css";
import { createRef, useEffect, useState } from "react";

const refResult     = createRef();

export default function Conversation({result, saying}) {
    useEffect(()=>{
        const elmPage = refResult.current;
        if (elmPage) {
            elmPage.scrollTop = elmPage.scrollHeight;
        }
    }, [saying, result])
    return (
            <div ref={refResult} className={styles.result}>
                <table className={styles.stable}>
                    <tbody>
                    {
                        result.map((item, index) =>
                            <tr key={index}>
                                <td className={(item.role=="me")? styles.td_me: styles.td_bot}>                                        
                                    <div className={(item.role=="me")? styles.item_me: styles.item_bot}>
                                        {item.text}
                                    </div>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
                {
                    (saying)
                    ? <div className={styles.saying}>{saying}</div>
                    : <></>
                }
            </div>
        )
}
