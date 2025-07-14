"use client"
import Link from "next/link"
import styles from "./readme.module.css"
import { Github } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from "@/lib/store"
import { extractThumbnailImage, insertOrReplaceTopImage, replaceLinkInReadme } from "@/lib/utils"
import { pushReadmetoRepo, pushThumbnailtoRepo } from "@/app/actions/githubApiCalls"
import { v4 as uuidv4 } from "uuid"
import { redirect, useRouter } from "next/navigation"



export default function ReadmeEditor() {
    const router=useRouter();

    const resThumbnailUrl = useStore((state) => state.resThumbnailUrl);
    const resReadmeText = useStore((state) => state.resReadmeText);
    const currentRepoDetails = useStore((state) => state.currentRepoDetails);

    const [displayScreen, setDisplayScreen] = useState<"edit" | "preview">("preview");
    const [readmeText, setReadmeText] = useState(resReadmeText);

    function replaceRelativeLinks(
        markdown: string,
        owner: string,
        repo: string,
        branch: string
    ): string {
        const githubBase = `https://github.com/${owner}/${repo}/raw/${branch}/`;

        // This regex finds all markdown links or image paths starting with ./
        const relativeLinkRegex = /(\]\()(\.\/[^)]+)(\))/g;

        return markdown.replace(relativeLinkRegex, (_match, prefix, path, suffix) => {
            return `${prefix}${githubBase}${path.slice(2)}${suffix}`;
        });
    }

    if (!currentRepoDetails) return;

    useEffect(() => {
        if (resThumbnailUrl) {
            setReadmeText(insertOrReplaceTopImage(readmeText || "", resThumbnailUrl));
        }
    }, [])

    const [loadingPushBtn, setLoadingPushBtn] = useState(false);

    return (<>
        <div className={styles.main}>
            <div className="flex items-center gap-[6px] text-[16px] ml-[10px]">

                <Link href={`https://github.com/${currentRepoDetails.owner}`} target="_blank">
                    <h1 className="flex gap-[5px] items-center "><Github size={17} /> {currentRepoDetails.owner}</h1>
                </Link>
                /
                <Link href={`https://github.com/${currentRepoDetails.owner}/${currentRepoDetails.repo}/tree/${currentRepoDetails.branch}`} target="_blank">
                    <h1 className="flex gap-[5px] items-center text-[#f9411c] font-[600]">{currentRepoDetails.repo}</h1>
                </Link>
                /
                <h1>{currentRepoDetails.branch}</h1>


            </div>


            <div className="flex flex-col w-[100%]">
                <div className="bg-[var(--bgCol2)] py-[5px] px-[5px] rounded-tl-[10px] rounded-tr-[10px] flex gap-[5px] justify-between">
                    <div className="flex gap-[5px]">
                        <Button className="h-[30px]" variant={`${displayScreen == "edit" ? "default" : "outline"}`} onClick={() => { setDisplayScreen("edit") }}>
                            Edit
                        </Button>
                        <Button className="h-[30px]" variant={`${displayScreen == "preview" ? "default" : "outline"}`} onClick={() => { setDisplayScreen("preview") }}>
                            Preview
                        </Button>
                    </div>
                    <Button loading={loadingPushBtn} className="bg-[#238636] h-[30px] text-[white] hover:bg-[#238636]/90" onClick={async () => {

                        if (!currentRepoDetails || !readmeText) return;

                        setLoadingPushBtn(true);
                        let updatedReadmeText = null
                        if (resThumbnailUrl) {
                            const imageName = `landingPage-${uuidv4()}`
                            await pushThumbnailtoRepo({ owner: currentRepoDetails.owner, repo: currentRepoDetails.repo, branch: currentRepoDetails.branch, screenshotUrl: resThumbnailUrl, imageFileName: imageName });

                            const oldImgLink = extractThumbnailImage(readmeText);

                            if (oldImgLink) {
                                updatedReadmeText = replaceLinkInReadme(readmeText, oldImgLink, `./public/assets/${imageName}`)
                            }
                            else {
                                setReadmeText(insertOrReplaceTopImage(readmeText, `./public/assets/${imageName}`))
                            }
                        }

                        await pushReadmetoRepo({ owner: currentRepoDetails.owner, repo: currentRepoDetails.repo, branch: currentRepoDetails.branch, readmeText: updatedReadmeText || readmeText });

                        router.push(`https://github.com/${currentRepoDetails.owner}/${currentRepoDetails.repo}/tree/${currentRepoDetails.branch}`)
                    }}>
                        Push to repo
                    </Button>
                </div>
                <div className="h-[100%] border-[1px] border-[var(--foreground)]/20 mx-[1px] rounded-bl-[10px] rounded-br-[10px]">
                    {displayScreen == "edit" &&
                        <Textarea className="min-h-[75vh] rounded-tl-[0px] rounded-tr-[0px] bg-[var(--bgCol)]" defaultValue={readmeText || ""} onChange={(e) => { setReadmeText(e.target.value.trim()) }} />
                    }
                    {displayScreen == "preview" &&
                        <div className={styles.markdownDiv}>
                            <ReactMarkdown
                                children={replaceRelativeLinks(readmeText || "", currentRepoDetails.owner, currentRepoDetails.repo, currentRepoDetails.branch)}
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({ node, ...props }) => (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    code: ({ node, className, children, ...props }) => {
                                        return (
                                            <code className={styles.code} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }} />
                        </div>}

                </div>
            </div>
        </div>
    </>)
}