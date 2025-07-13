"use client"
import NewRepo from "@/components/newRepo/newRepo"
import styles from "./dashboard.module.css"
import { useState } from "react"
import MakingReadme from "@/components/makingReadme/makingReadme";


export default function Dashboard() {
    const [repoTree, setRepoTree] = useState<any[] | null>(null);


    return (<>
        <div className={styles.main}>
            {/* {!repoTree &&
            } */}
            <NewRepo key={1} setRepoTree={setRepoTree} />

            {/* {repoTree &&
                <MakingReadme repoTree={repoTree} />
            } */}


        </div></>)
}