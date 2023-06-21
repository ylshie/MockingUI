import styles from "./menu.module.css";
import { createRef } from "react";

const refCounter    = createRef();

export default function Menu({menu}) {
    return (
        <div className={styles.orderframe}>
            <div className={styles.order}>
            {menu.name}:
            <img className={styles.menu} src={menu.image} />
            </div>
        </div>
        )
}
