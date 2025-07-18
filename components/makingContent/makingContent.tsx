"use client"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FileScrollAnimation } from "../fileScrollAnimation/fileScrollAnimation";
import { getBranches, getGithubProfile, getLanguagePercentage, getRepoDetails, getRepoTree } from "@/app/actions/githubApiCalls";
import { useStore } from "@/lib/store";

import styles from "./makingContent.module.css"
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitFork, ImageIcon, Link2, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { extractThumbnailImage, filterOnlyFilesTree, removeMediaFilesTree, replaceRelativeLinks } from "@/lib/utils";
import { getReadme } from "@/lib/singleThreadBullshi";
import { Button } from "../ui/button";


const languageColors: Record<string, string> = {
    "TypeScript": "#3178c6",
    "JavaScript": "#f1e05a",
    "Python": "#3572A5",
    "Java": "#b07219",
    "Go": "#00ADD8",
    "Ruby": "#701516",
    "PHP": "#4F5D95",
    "C": "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    "Rust": "#dea584",
    "Swift": "#ffac45",
    "Kotlin": "#A97BFF",
    "Dart": "#00B4AB",
    "Shell": "#89e051",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "SCSS": "#c6538c",
    "SASS": "#a53b70",
    "Less": "#1d365d",
    "JSON": "#292929",
    "YAML": "#cb171e",
    "Markdown": "#083fa1",
    "SQL": "#e38c00",
    "Haskell": "#5e5086",
    "Elixir": "#6e4a7e",
    "R": "#198CE7",
    "Lua": "#000080",
    "Perl": "#0298c3",
    "CoffeeScript": "#244776",
    "TeX": "#3D6117",
    "Scala": "#c22d40",
    "OCaml": "#3be133",
    "Groovy": "#4298b8",
    "Julia": "#a270ba",
    "Crystal": "#000100",
    "Dockerfile": "#384d54",
}
type Props = {
    languageData: Record<string, number>;
};



export default function MakingContentScreen() {
    const currentRepoDetails = useStore((state) => state.currentRepoDetails);
    // const currentRepoDetails = { owner: "abhraneeldhar7", repo: "portfolio", branch: "master" }
    const { data: session } = useSession();

    const dummyFilePaths = [
        "README.md",
        "package.json",
        "public/assets/logo.png",
        "public/index.html",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/components/Navbar.tsx",
        "src/components/Footer.tsx",
        "src/components/Button.tsx",
        "src/hooks/useAuth.ts",
        "src/lib/utils.ts",
        "src/styles/global.css",
        "src/pages/dashboard/index.tsx",
        "src/pages/settings/profile.tsx",
        "src/api/auth/login.ts",
        "src/api/users/getUsers.ts",
        "tests/components/Navbar.test.tsx",
        "tests/utils/utils.test.ts",
        ".github/workflows/deploy.yml",
        ".env.example",
        "next.config.js",
        "tsconfig.json"
    ];
    function LanguageBar({ languageData }: Props) {
        const totalBytes = Object.values(languageData).reduce((acc, val) => acc + val, 0);

        const percentages = Object.entries(languageData).map(([lang, bytes]) => ({
            language: lang,
            bytes,
            percent: (bytes / totalBytes) * 100,
            color: languageColors[lang] || '#ccc',
        }));

        return (
            <div className="w-full max-w-3xl">
                <div className="flex h-[6px] overflow-hidden rounded-[4px] mb-3">
                    {percentages.map(({ language, percent, color }) => (
                        <div
                            key={language}
                            className="h-full"
                            style={{
                                width: `${percent}%`,
                                backgroundColor: color,
                            }}
                            title={`${language}: ${percent.toFixed(2)}%`}
                        />
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 text-[12px]">
                    {percentages.map(({ language, percent, color }) => (
                        <div key={language} className="flex items-center gap-1 font-[400]">
                            <span
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: color }}
                            ></span>
                            <span>{language}</span>
                            <span className="opacity-[0.5]">({percent.toFixed(2)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }



    const [filePathNames, setFilePathNames] = useState(dummyFilePaths)
    const [ownerDetails, setOwnerDetails] = useState<{
        avatar_url: string,
        name: string,
        bio: string
    } | null>(null)
    const [extraRepoDetails, setextraRepoDetails] = useState<any | null>(null)
    const [languagesPercentage, setLanguagesPercentage] = useState<any | null>(null)


    const [thumbnailUrl, setThumbnailUrl] = useState<string | boolean | null>(null)


    function sanitizeLink(link: string) {
        if (link.startsWith('http')) return link;
        if (!currentRepoDetails) return "";
        return `https://github.com/${currentRepoDetails.owner}/${currentRepoDetails.repo}/raw/${currentRepoDetails.branch}/${link}`;
    }
    useEffect(() => {
        console.log("useeffect run")
        if (currentRepoDetails == null) return;

        const getAll = async () => {



            const gettingTree = async () => {
                const repoTree = await getRepoTree(currentRepoDetails.owner, currentRepoDetails.repo, currentRepoDetails.branch);
                setRepoTree(filterOnlyFilesTree(removeMediaFilesTree(repoTree.tree)));
                setFilePathNames(repoTree.tree
                    .map((file: any) => file.path)
                    .sort((a: any, b: any) => a.localeCompare(b)))
            }
            gettingTree();

            const gettingOwnerDetails = async () => {
                const res = await getGithubProfile(currentRepoDetails.owner);
                console.log("owner details: ", res)
                setOwnerDetails(res);
            }
            gettingOwnerDetails();

            const gettingRepoDetails = async () => {
                const res = await getRepoDetails(`https://github.com/${currentRepoDetails.owner}/${currentRepoDetails.repo}`);
                setextraRepoDetails(res);
                console.log("repo details: ", res);



                const lang = await getLanguagePercentage(res.languages_url);
                setLanguagesPercentage(lang);
            }
            gettingRepoDetails();



        }
        getAll();
    }, [])



    useEffect(() => {
        if (!currentRepoDetails || !extraRepoDetails) return;
        if (!session) return


        const gettingThumbnailFromReadme = async (repoDetails: any) => {
            const existingReadme = await getReadme(currentRepoDetails.owner, currentRepoDetails.repo, session.user.accessToken);
            console.log("readmetext: ", existingReadme)

            if (repoDetails.homepage?.length) {
                const imageUrl = `https://api.microlink.io/?url=${encodeURIComponent(repoDetails.homepage)}&screenshot=true`;
                console.log("getting thummbnail from livelink")
                const imgRes = await fetch(imageUrl);
                const imgData = await imgRes.json();
                const screenshotUrl = imgData?.data?.screenshot?.url;
                setThumbnailUrl(screenshotUrl);
            }
            else {
                console.log("getting thumbnail from readme")

                let thumbnailUrl = extractThumbnailImage(existingReadme as string);
                console.log("found in readme: ", thumbnailUrl)
                if (thumbnailUrl) {
                    setThumbnailUrl(sanitizeLink(thumbnailUrl));
                }
                else {
                    setThumbnailUrl("0");
                }
            }
        }
        console.log("starting readmethang")
        gettingThumbnailFromReadme(extraRepoDetails)

    }, [extraRepoDetails, currentRepoDetails, session])



    interface RepoTreeObject {
        path: string;
        mode: string;
        type: string;
        sha: string;
        size: number;
        url: string;
    }
    const [repoTree, setRepoTree] = useState<RepoTreeObject[] | null>(null);
    const [logFileArray, setLogArray] = useState<{ time: string, file: RepoTreeObject }[] | null>(null);
    const [currentlyAnalyzingFile, setcurrentlyAnalyzingFile] = useState<RepoTreeObject | null>(null);
    const [currentlyAnalyzingIndex, setcurrentlyAnalyzingIndex] = useState(0)

    const getDelay = (size: number | undefined) => {
        if (!size) return 500;
        return 1000 + Math.floor(size);
    };
    useEffect(() => {
        if (!repoTree) return;
        if (currentlyAnalyzingIndex >= repoTree.length) return;
        setcurrentlyAnalyzingFile(repoTree[currentlyAnalyzingIndex]);

        const timer = setTimeout(() => {
            const time = new Date()
            let tempLogArray = logFileArray || [{ time: time.toLocaleTimeString('en-GB'), file: repoTree[0] }];
            tempLogArray?.push({ time: time.toLocaleTimeString('en-GB'), file: repoTree[currentlyAnalyzingIndex] });
            setLogArray(tempLogArray);
            setcurrentlyAnalyzingIndex(currentlyAnalyzingIndex + 1);

        }, getDelay(currentlyAnalyzingFile?.size));

        return () => clearTimeout(timer);
    }, [repoTree, currentlyAnalyzingIndex])




    const makingStatus = useStore((state) => state.makingStatus);
    // const makingStatus = "ready"

    return (<>
        <div className={styles.main}>

            <div className="flex-1 flex flex-col gap-[25px]">
                {ownerDetails &&
                    <div className="flex h-[40px] items-center gap-[10px]">
                        <Image src={ownerDetails?.avatar_url} className="rounded-[50%]" unoptimized height={40} width={40} alt="" />

                        {currentRepoDetails &&
                            <h1 className="text-[18px]">
                                <Link href={`https://github.com/${currentRepoDetails.owner}`} target="_blank">{currentRepoDetails.owner}</Link> / <Link href={`https://github.com/${currentRepoDetails.owner}/${currentRepoDetails.repo}/tree/${currentRepoDetails.branch}`} target="_blank">{currentRepoDetails.repo}</Link>
                            </h1>
                        }

                        <div className="text-[12px] bg-[var(--primary)] text-[var(--secondary)] py-[5px] px-[10px] flex items-center leading-[1em] rounded-[20px]">
                            {extraRepoDetails?.private ? "Private" : "Public"}
                        </div>
                    </div>
                }
                {extraRepoDetails &&
                    <div className={styles.aboutDiv}>
                        <h1 className="text-[20px]">About</h1>
                        <div className="flex flex-col gap-[10px]">
                            <p className="text-[14px]">{extraRepoDetails.description}</p>
                            {extraRepoDetails.homepage ?
                                <Link href={extraRepoDetails.homepage} target="_blank">
                                    <p className="text-[#4493f8] flex gap-[5px] text-[14px] items-center break-words">
                                        Deployment Link <ArrowUpRight size={15} /></p>
                                </Link> :
                                <Link href="" target="_blank">
                                    <p className="text-[#4493f8] flex gap-[5px] text-[14px] items-center break-words">
                                        View Repository <ArrowUpRight size={15} /></p>
                                </Link>
                            }

                            <p className="flex gap-[10px] items-center text-[12px] opacity-[0.6]"><Star size={12} />{extraRepoDetails.stargazers_count} stars</p>

                            <p className="flex gap-[10px] items-center text-[12px] opacity-[0.6]"><GitFork size={12} />{extraRepoDetails.forks_count} forks</p>
                        </div>
                    </div>

                }
                {languagesPercentage &&
                    <div className="max-w-[350px]">
                        <LanguageBar languageData={languagesPercentage} />
                    </div>
                }
            </div>


            <div className={`flex-${thumbnailUrl ? "2" : "1"} mt-[10px] flex flex-col gap-[25px]`}>
                {thumbnailUrl != "0" &&
                    <div className={styles.thumbnailHolder}>
                        {thumbnailUrl &&
                            <Image src={thumbnailUrl as string} height={100} width={300} alt="" unoptimized />
                        }
                        {thumbnailUrl === null && <div className={styles.loadingThumbnailDiv}>
                            <ImageIcon size={30} className="opacity-[0.7]" />
                        </div>}
                    </div>
                }

                {makingStatus === "ready" ? <div className="flex flex-col gap-[10px] items-center">
                    <h1 className="text-[20px]">Your file is ready !</h1>
                    {currentRepoDetails &&
                        <Link href={`https://github.com/${currentRepoDetails?.owner}/${currentRepoDetails.repo}/tree/${currentRepoDetails?.branch}`}>
                            <Button className="w-[100%]">
                                Go to repo
                            </Button>
                        </Link>
                    }
                </div> :
                    <div className="flex flex-col gap-[5px]">
                        <h1 className="text-[20px]">Parsing Files</h1>
                        <FileScrollAnimation filePaths={filePathNames} />
                    </div>
                }
            </div>

            <div className={styles.logsMain}>
                <div className="rounded-[15px] bg-[var(--bgCol2)] flex flex-col justify-between py-[10px] px-[10px] gap-[20px]">
                    <p>Read our top articles in the meantime we cook the perfect readme for you</p>
                    <Link className="flex gap-[5px] items-center leading-[1em] rounded-[50px] ml-auto text-[12px] py-[10px] px-[15px] text-[var(--foreground)] bg-[var(--background)]" href="https://www.bugspot.in/home" target="_blank">
                        Visit <ArrowUpRight size={12} />
                    </Link>
                </div>
                <div className="w-[100%] flex flex-col">
                    <div className={styles.logsHeading}>
                        Analyzing files
                    </div>
                    <div className={styles.logsContent}>
                        {logFileArray && logFileArray.map((file, index) => (
                            <div key={index} className="flex items-center gap-[5px] px-[10px] py-[5px]">
                                <div className="overflow-hidden w-[70px] opacity-[0.6]">
                                    <div className="">{file.time}</div>
                                </div>
                                <p className="text-ellipsis overflow-hidden whitespace-nowrap w-[200px]">
                                    analyzed {file && file.file.path.split("/")[file.file.path.split("/").length - 1]}
                                </p>
                                <div className="w-[40px] ml-auto bg-[#007a4d] rounded-[30px] text-center text-[10px] text-[white]">
                                    Done
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className={styles.logsFooter}>
                        <h2 className="text-[14px] overflow-hidden text-ellipsis">{currentlyAnalyzingFile?.path && currentlyAnalyzingFile.path.split("/")[currentlyAnalyzingFile.path.split("/").length - 1]}</h2>
                    </div>
                </div>
            </div>
        </div>
    </>)
}