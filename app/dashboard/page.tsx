"use client"
import NewRepo from "@/components/newRepo/newRepo"
import styles from "./dashboard.module.css"

export default function Dashboard() {
    return (<>
        <div className={styles.main}>
            <NewRepo key={1}/>
        </div></>)
}