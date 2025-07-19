"use client"
import { useSession } from "next-auth/react"
import { Button } from "../ui/button"
import styles from "./tabBar.module.css"
import Link from "next/link"
import appLogo from "../../public/appLogo.png"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useStore } from "@/lib/store"
export default function TabBar() {
    const { data: session } = useSession();
    const pathname = usePathname();


    const dashboardScreen = useStore((state) => state.dashboardScreen);
    const setDashboardScreen = useStore((state) => state.setDashboardScreen);


    return (<div className={styles.main}>
        <div className="h-[50px] bg-[var(--background)]/10 dark:bg-[var(--background)]/40 backdrop-blur-[60px] flex items-center p-[10px] justify-between relative">
            <div>
                <Link href="/">
                    <Image src={appLogo} height={35} width={35} alt="" unoptimized />
                </Link>
            </div>


            <div className={styles.navOptionsDiv}>
                <div className={styles.navOptions}>
                  
                </div>
            </div>

            {!session &&
                <Link href="/login" className="ml-[auto]">
                    <Button variant="outline" >Login</Button>
                </Link>
            }
            {session && pathname.split("/")[1].length == 0 &&
                <Link href="/dashboard" className="ml-[auto]">
                    <Button variant="outline" onClick={() => { setDashboardScreen("newReadme") }}>Dashboard</Button>
                </Link>
            }
            {pathname.split("/")[1] == "dashboard" && dashboardScreen != "newReadme" && <Button variant="outline" onClick={() => { setDashboardScreen("newReadme") }}>Dashboard</Button>}
        </div>
        <div className={styles.bb}></div>
    </div>)
}