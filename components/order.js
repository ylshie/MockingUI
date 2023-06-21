import styles from "./order.module.css";

export default function Order({orders}) {
    return (
        <div className={styles.orderframe}>
            <div className={styles.order}>
                <div>你的點餐明細:</div>
                <div>
                {
                    orders.map((item, index)=>
                        <div key={index}>{item.order}</div>
                    )
                }
                </div>
            </div>
        </div>
        )
}
