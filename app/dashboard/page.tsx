"use client"
import NewRepo from "@/components/newRepo/newRepo"
import styles from "./dashboard.module.css"
import { useEffect, useState } from "react"
import MakingContentScreen from "@/components/makingContent/makingContent"
import ReadmeEditor from "@/components/readmeEditor/readmeEditor";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { getGithubProfile } from "../actions/githubApiCalls";
import { getUserDescription } from "../actions/groqFuncitons";
import { ToastContainer, Bounce } from 'react-toastify';
import { useSession } from "next-auth/react";
import TabBar from "@/components/tabBar/tabBar"

export default function Dashboard() {
    const [repoTree, setRepoTree] = useState<any[] | null>(null);
    const dashboardScreen = useStore((state) => state.dashboardScreen);

    const { data: session } = useSession();
    const currentRepoDetails = useStore((state) => state.currentRepoDetails);
    useEffect(() => {
        // console.log("currentrepo from dashbaord: ", currentRepoDetails)
    }, [currentRepoDetails])
    return (<>
        {dashboardScreen != "newReadme" &&
            <TabBar />
        }
        <div className={styles.main}>
            {dashboardScreen == "newReadme" &&
                <NewRepo setRepoTree={setRepoTree} />
            }

            {dashboardScreen == "loading" &&
                <MakingContentScreen />
            }

            {dashboardScreen == "editor" &&
                <ReadmeEditor />
            }

        </div></>)
}