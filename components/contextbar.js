import styles from "./contextbar.module.css";
import { createRef, useEffect, useState } from "react";
import { CONTEXT_COFFEE, CONTEXT_PACIFIC, TITLE_COFFEE, TITLE_PACIFIC, CONTEXT_MAC, TITLE_MAC } from "../common/context"
import { postForm } from "../common/util"

const refResult     = createRef();
const refCounter    = createRef();

export default function ContextBar({tlist, onChanged=null}) {
    const [id,     setId]       = useState(null);
    const [title,  setTitle]    = useState("");
    const [prefix, setPrefix]   = useState(CONTEXT_PACIFIC);
    const [index,  setIndex]    = useState(0)
    const [label,  setLabel]    = useState(false)

    useEffect(()=>{
    })
    async function onSelect(event) {
        const index = event.target.value;
        const item  = (index && tlist) ? tlist[index]: null;
        if (item) {
            setIndex(index);
            setId(item._id);
            setTitle(item.name)
            setPrefix(item.text);
        }
        if (onChanged) onChanged(index, item);
    }
    async function addContext() {
        postForm('/addcontext', {mode: 'add'});
    }
    async function editContext() {
        postForm('/addcontext', {mode: 'edit', id: id, name: title, text: prefix});
    }
    async function delContext() {
        const response = await fetch("/api/del", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id}),
        });
        window.location.reload();
    }
    return (
            ((tlist && tlist.length > 0)
            ? <div className={styles.optionpanel}>
                {(label)? <><span className={styles.title}>GPT BOT</span><span ref={refCounter}></span></>: <></>}
                <select className={styles.dropdown} onChange={onSelect}>
                {
                    tlist.map((item, index) => {
                        return <option key={index} value={index}>{item.name}</option>
                    })
                }
                </select>
                <button className={styles.action} onClick={addContext} >新增</button>
                <button className={styles.action} onClick={editContext}>編輯</button>
                {/*<button onClick={delContext}>-</button>*/}
            </div>
            : <div className={styles.optionpanel}>
                <button>Add default</button>
            </div>)
        )
}
