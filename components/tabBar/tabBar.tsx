import styles from "./tabBar.module.css"
export default function TabBar() {
    return (<div className={styles.main}>
        <div className="h-[50px] bg-[var(--background)]/50 dark:bg-[var(--background)]/70 backdrop-blur-[30px]"></div>
        <div className={styles.bb}></div>
    </div>)
}