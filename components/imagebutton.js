import { useState } from "react";
import styles from "./imagebutton.module.css";

export default function ImageButton({Active, ImageUp, ImageDn, onClick}) {
    const [DN, setDN]   = useState(Active)
    function onMouseDown() {
        setDN(Active || true);
    }
    function onMouseUp() {
        setDN(Active || false);
    }
    function onTouchStart() {
        setDN(Active || true);
    }
    function onTouchEnd() {
        setDN(Active || false);
    }
    return (            
            <div className={styles.button}
                    onMouseDown = {onMouseDown} 
                    onMouseUp   = {onMouseUp} 
                    onTouchStart= {onTouchStart}
                    onTouchEnd  = {onTouchEnd}
                    onClick     = {onClick}>
                {
                    (DN)
                    ? <img src={ImageDn}/>
                    : <img src={ImageUp}/>
                }
            </div>    
        )
}
