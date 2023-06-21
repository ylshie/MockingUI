import styles from "./avatar.module.css";
import { createRef, useEffect, useState } from "react";
import { setSpeak, createScene, loadVRM, playThreeAction } from "../common/avatar";

const refFrame = createRef();
let first = true;
let avatar = null;
export default function Avatar({file,action=null,speak=false,pose=0,light=false}) {
    const [scene,   setScene]   = useState(null)
    const [vrm,     setVrm]     = useState(null);
    const [vfile,   setVFile]   = useState(null);
    const [vction,  setVction]  = useState(null);

    //console.log("avatar")
    useEffect(()=>{
        setSpeak(speak)
    },[speak])
    useEffect(()=>{
        if (! refFrame.current) return;
        if (scene) return;

        // TODO
        // temporary workaround
        if (avatar != refFrame.current) {
            avatar = refFrame.current;
            const set = createScene(refFrame.current, pose, light);
            setScene(set.scene);
        } else {
            console.log("avatar: same ref")
        }
    },[scene, refFrame.current])
    useEffect(()=>{
        if (file != vfile) {
            const model=loadVRM(file);
            setVrm(model);
            setVFile(file);
        }
        if (action != vction) {
            if (action.length > 1)  {
                playThreeAction(action[0], 1, action[1]);
            } else {
                playThreeAction(action[0]);
            }
            setVction(action);
        }
    },[file,action])
    return (
            <div ref={refFrame} id={styles.three}></div>
        )
}
