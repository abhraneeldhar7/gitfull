"use client"
import NewRepo from "@/components/newRepo/newRepo"
import styles from "./dashboard.module.css"
import { useState } from "react"
import MakingReadme from "@/components/makingReadme/makingReadme";
import ReadmeEditor from "@/components/readmeEditor/readmeEditor";
import { useStore } from "@/lib/store";


export default function Dashboard() {
    const [repoTree, setRepoTree] = useState<any[] | null>(null);
    const dashboardScreen = useStore((state) => state.dashboardScreen);

    return (<>
        <div className={styles.main}>
            {/* {!repoTree &&
            } */}
            {dashboardScreen == "newReadme" &&
                <NewRepo key={1} setRepoTree={setRepoTree} />
            }

            {dashboardScreen == "loading" &&
                <MakingReadme />
            }

            {dashboardScreen == "editor" &&
                <ReadmeEditor />
            }

        </div></>)
}