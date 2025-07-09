"use client"
import { useSession } from "next-auth/react"
import { Button } from "../ui/button"
import styles from "./tabBar.module.css"
import Link from "next/link"
export default function TabBar() {
    const { data: session } = useSession()
    return (<div className={styles.main}>
        <div className="h-[50px] bg-[var(--background)]/50 dark:bg-[var(--background)]/70 backdrop-blur-[30px] flex items-center p-[10px] justify-between relative">

            <div className={styles.navOptionsDiv}>
                <div className={styles.navOptions}>
                    <Button className="text-[var(--foreground)] bg-transparent text-[16px]">
                        Examples
                    </Button>

                    <Button className="text-[var(--foreground)] bg-transparent text-[16px]">
                        Reviews
                    </Button>

                    <Button className="text-[var(--foreground)] bg-transparent text-[16px]">
                        Updates
                    </Button>
                </div>
            </div>

            {!session &&
                <Link href="/login" className="ml-[auto]">
                    <Button variant="outline" >Login</Button>
                </Link>
            }
            {session &&
                <Link href="/dashboard" className="ml-[auto]">
                    <Button variant="outline">Dashboard</Button>
                </Link>
            }
        </div>
        <div className={styles.bb}></div>
    </div>)
}