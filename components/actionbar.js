import styles from "./actionbar.module.css";
import { useState, useEffect } from 'react';

export default function ActionBar({doModel, doAction}) {
    async function actStill() { doAction('still');}
    async function actWave()  { doAction('wave');}
    async function actBow()   { doAction('bow');}
    async function actRun()   { doAction('run');}
    async function actDance() { doAction('dance');}
    async function actWalk()  { doAction('walk');}
    return (
        <div className={styles.action}>
            <div className={styles.modelinner}>
                <select onChange={doModel}>
                    <option value={"demo-5.vrm"} default>Himeno</option>
                    <option value={"bochi-1.vrm"}>Bochi</option>
                    <option value={"femo-1.vrm"}>Bochi</option>
                    <option value={"hemo-1.vrm"}>Bochi</option>
                    <option value={"kemo-1.vrm"}>Bochi</option>
                    <option value={"cc4qq1.vrm"}>CC4</option>
                </select>
            </div>
            <div className={styles.actioninner}>
                <button onClick={actStill}>still</button>
                <button onClick={actWave}>wave</button>
                <button onClick={actBow}>bow</button>
                <button onClick={actRun}>run</button>
                <button onClick={actDance}>dance</button>
                <button onClick={actWalk}>walk</button>
            </div>
        </div>
        )
}
