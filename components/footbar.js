import styles from "./footbar.module.css";
import ImageButton from "./imagebutton";
//import { useState, useEffect } from 'react';
//import { CONTEXT_COFFEE, CONTEXT_PACIFIC, TITLE_COFFEE, TITLE_PACIFIC } from "../common/context"

export default function FootBar({Current}) {
    async function onBack() {
        window.location.href = "/";
    }
    function Go(url) {
        window.location.href = "/" + url;
    }
    return (
            <div className={styles.footbar}>
                <img className={styles.footback} src="footbase.svg"/>
                <div className={styles.buttonframe}>
                    <div className={styles.frameinner}>
                        <ImageButton Active={(Current=="message")} 
                                     ImageUp={"btnmsg.svg"} 
                                     ImageDn={"btnmsgdn.svg"} 
                                     onClick={()=>Go("message")}/>
                        <ImageButton Active={(Current=="location")}
                                     ImageUp={"btnloc.svg"} 
                                     ImageDn={"btnlocdn.svg"} 
                                     onClick={()=>Go("location")}/>
                        <ImageButton Active={(Current=="profile")}
                                     ImageUp={"btnpro.svg"} 
                                     ImageDn={"btnprodn.svg"} 
                                     onClick={()=>Go("profile")}/>
                    </div>
                </div>
            </div>
        )
}
