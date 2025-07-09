"use client"
import { useSession } from "next-auth/react"
import { Button } from "../ui/button"
import styles from "./tabBar.module.css"
export default function TabBar() {
    const { data: session } = useSession()
    return (<div className={styles.main}>
        <div className="h-[50px] bg-[var(--background)]/50 dark:bg-[var(--background)]/70 backdrop-blur-[30px] flex items-center p-[10px] justify-between">
            
            
            {!session &&
                <Button variant="outline" className="ml-[auto]">Login</Button>
            }
            {session &&
                <Button variant="outline" className="ml-[auto]">Dashboard</Button>
            }
        </div>
        <div className={styles.bb}></div>
    </div>)
}