"use client"
import Link from "next/link"
import styles from "./readme.module.css"
import { Download, Github } from "lucide-react"
import { Textarea } from "../ui/textarea"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import mermaid from "mermaid";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from "@/lib/store"
import { downloadReadmeFile, extractThumbnailImage, insertOrReplaceTopImage, replaceLinkInReadme, replaceRelativeLinks } from "@/lib/utils"
import { pushReadmetoRepo, pushThumbnailtoRepo } from "@/app/actions/githubApiCalls"
import { v4 as uuidv4 } from "uuid"
import { redirect, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import MarkdownRender from "../markdownRender/markdownRender"

export default function ReadmeEditor() {
    const router = useRouter();

    const resThumbnailUrl = useStore((state) => state.resThumbnailUrl);
    const resReadmeText = useStore((state) => state.resReadmeText);
    const currentRepoDetails = useStore((state) => state.currentRepoDetails);

    const [displayScreen, setDisplayScreen] = useState<"edit" | "preview">("preview");
    const [readmeText, setReadmeText] = useState(resReadmeText);

    const { data: session } = useSession();




    if (!currentRepoDetails) return;

    useEffect(() => {
        if (resThumbnailUrl) {
            setReadmeText(insertOrReplaceTopImage(readmeText || "", resThumbnailUrl));
        }
    }, [])

    const [loadingPushBtn, setLoadingPushBtn] = useState(false);

    const imageName = `landingPage-${uuidv4().slice(0, 4)}`

    const Mermaid = ({ code }: { code: string }) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const id = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

        useEffect(() => {
            mermaid.initialize({ startOnLoad: false });

            if (containerRef.current) {
                // Clear any previous render
                containerRef.current.innerHTML = "";

                // Use renderAsync in modern versions
                mermaid.render(id.current, code).then(({ svg }) => {
                    containerRef.current!.innerHTML = svg;
                }).catch((err) => {
                    containerRef.current!.innerHTML = `<pre style="color:red;">Mermaid render error:\n${err.message}</pre>`;
                });
            }
        }, [code]);

        return <div ref={containerRef} />;
    };


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
                    <div className="flex items-center gap-[6px]">
                        <Button variant="outline" className="h-[30px]" onClick={() => {
                            if (!readmeText) return;
                            downloadReadmeFile(readmeText, resThumbnailUrl, imageName)
                        }}>
                            <Download />
                        </Button>
                        {(session?.user.login == currentRepoDetails.owner) &&
                            <Button disabled={!(session?.user.login == currentRepoDetails.owner)} loading={loadingPushBtn} className="bg-[#238636] h-[30px] text-[white] hover:bg-[#238636]/90" onClick={async () => {

                                if (!currentRepoDetails || !readmeText) return;

                                setLoadingPushBtn(true);
                                let updatedReadmeText = null
                                if (resThumbnailUrl) {

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

                                window.open(`https://github.com/${currentRepoDetails.owner}/${currentRepoDetails.repo}/tree/${currentRepoDetails.branch}`, "_blank")
                                router.push(`https://github.com/${currentRepoDetails.owner}/${currentRepoDetails.repo}/tree/${currentRepoDetails.branch}`)
                            }}>
                                Push to repo
                            </Button>}
                    </div>
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
                                rehypePlugins={[rehypeRaw, rehypeHighlight]}
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

                            {/* <MarkdownRender content={readmeText || "aaa"} /> */}


                        </div>}

                </div>
            </div>
        </div>
    </>)
}