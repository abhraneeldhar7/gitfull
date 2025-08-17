"use client"
import { Check, CheckSquare, ChevronDown, ChevronRight, CornerRightDown, FileCheck2, GitBranch, Github, GithubIcon, LoaderCircle, Lock, LogOut, Search, Settings, SlashIcon, Users } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import styles from "./nreRepo.module.css"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { getBranches, getRepoDetails, getRepos, getRepoTree, pushReadmetoRepo, pushThumbnailtoRepo } from "@/app/actions/githubApiCalls"
import { estimateTokens, extractThumbnailImage, filterOnlyFilesTree, insertOrReplaceTopImage, removeCSSFilesTree, removeMediaFilesTree, replaceLinkInReadme, timeAgo } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import Image from "next/image"

import githubBanner from "../../public/banners/githubBanner.webp"
import xBanner from "../../public/banners/xBanner.avif"
import bugspotBanner from "../../public/banners/darkmode.png"
import artisticBg from "../../public/banners/artistic-blurry-colorful-wallpaper-background.jpg"
import linkedInBanner from "../../public/banners/linkedinBanner.png"
import { Switch } from "../ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { PopoverClose } from "@radix-ui/react-popover"
import { makeReadme } from "@/app/actions/groqFuncitons"
import { Input } from "../ui/input"
import { useStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"
import { redirect, useRouter } from "next/navigation"
import { Bounce, toast } from "react-toastify"
import { signOut, useSession } from "next-auth/react"
import MakingContentScreen from "../makingContent/makingContent"
import { NumberTicker } from "../magicui/number-ticker"
import { userType } from "@/lib/types"
import { getUserDetails } from "@/app/actions/mongodbFunctions"


export default function NewRepo({ setRepoTree }: { setRepoTree: Dispatch<SetStateAction<any[] | null>> }) {
    const router = useRouter();
    const [userRepos, setUserRepos] = useState<any[] | null>(null);

    const { data: session } = useSession();

    const [userDetails, setUserDetails] = useState<userType | null>(null)

    useEffect(() => {
        const a = async () => {
            const repos = await getRepos();
            setUserRepos(repos)
        }
        a();
        setMakingStatus(null)
    }, [])

    useEffect(() => {
        if (!session) return;
        const a = async () => {
            const userRes = await getUserDetails(session.user.email);
            setUserDetails(userRes)
        }
        a();
    }, [session])

    const [selectedRepo, setSelectedRepo] = useState<any | null>(null)
    const [socialCard, setSocialCard] = useState<number[]>([1]);
    const toggleCard = (index: number) => {
        setSocialCard((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const [autoUpdateReadme, setAutoUpdateReadme] = useState(true);
    const [repoBranches, setRepoBranches] = useState<any[] | null>(null)
    const [selectedBranch, setSelectedBranch] = useState<any | null>(null);


    const [loadingTree, setLoadingTree] = useState(false);


    // const dashboardScreen = useStore((state) => state.dashboardScreen);
    const setDashboardScreen = useStore((state) => state.setDashboardScreen);
    const setResThumbnailUrl = useStore((state) => state.setResThumbnailUrl);
    const setResReadmeText = useStore((state) => state.setResReadmeText);
    const setCurrentRepoDetails = useStore((state) => state.setCurrentRepoDetails);
    const setMakingStatus = useStore((state) => state.setMakingStatus);

    useEffect(() => {
        if (!selectedRepo || !session) {
            setTokensNeeded(null);
            return;
        }



        if (session.user.login != selectedRepo.owner.login) {
            setAutoUpdateReadme(false);
        }

        setCurrentRepoDetails({ owner: selectedRepo.owner.login, repo: selectedRepo.name, branch: selectedBranch.name });

        const gettingEstimatedTokens = async () => {
            setLoadingTree(true);
            if (!selectedBranch) return;
            const repoTree = await getRepoTree(selectedRepo.owner.login, selectedRepo.name, selectedBranch.name)
            const filteredTree = removeMediaFilesTree(filterOnlyFilesTree(removeCSSFilesTree(repoTree.tree)));
            const estimate = estimateTokens(filteredTree);
            console.log(estimate)
            setTokensNeeded(estimate);
            setLoadingTree(false);
        }
        gettingEstimatedTokens();
    }, [selectedBranch, session])



    const [checkingUrlLoader, setcheckingUrlLoader] = useState(false);
    const urlInputRef = useRef<HTMLInputElement>(null);


    const initiateMakingContent = async () => {

        if (!session || !selectedBranch) return;


        const groqRes = await makeReadme(selectedRepo.owner.login, selectedRepo.name, selectedBranch.name, session.user.email);
        setMakingStatus("making");
        if (groqRes) {
            let { thumbnailUrl, readmeText } = groqRes;
            const imageName = `landingPage-${uuidv4()}`
            if (thumbnailUrl) {
                const oldImgLink = extractThumbnailImage(readmeText);
                let updatedReadmeText = readmeText;
                if (oldImgLink) {
                    updatedReadmeText = replaceLinkInReadme(readmeText, oldImgLink, `./public/assets/${imageName}`)
                }
                readmeText = insertOrReplaceTopImage(updatedReadmeText, `./public/assets/${imageName}`)
            }

            setResThumbnailUrl(thumbnailUrl);
            setResReadmeText(readmeText);

            if (autoUpdateReadme) {
                if (thumbnailUrl) {
                    await pushThumbnailtoRepo({ owner: selectedRepo.owner.login, repo: selectedRepo.name, branch: selectedBranch.name, screenshotUrl: thumbnailUrl, imageFileName: imageName });
                }
                await pushReadmetoRepo({ owner: selectedRepo.owner.login, repo: selectedRepo.name, branch: selectedBranch.name, readmeText: readmeText });

                window.open(`https://github.com/${selectedRepo.owner.login}/${selectedRepo.name}/tree/${selectedBranch.name}`, "_blank")
                router.push(`https://github.com/${selectedRepo.owner.login}/${selectedRepo.name}/tree/${selectedBranch.name}`)
            }
            else {
                setDashboardScreen("editor");
            }
            setMakingStatus("ready")
        }

        setLoadingTree(false)
    }

    const [tokensNeeded, setTokensNeeded] = useState<number | null>(null)

    return <><div className={styles.main}>
        <div className="flex-1 flex flex-col gap-[10px] flex-1 p-[6px] md:p-[20px] rounded-[10px] border-[1px] border-[var(--foreground)]/10 bg-[var(--bgCol)] max-w-[600px] mx-auto">
            <h1 className="text-[30px] px-[10px] md:px-[0px]">Select your Repository</h1>

            {userDetails &&
                <div className="flex gap-[2px] items-center">
                    <div className="flex-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="bg-[var(--background)] border border-[1px] border-[var(--secondary)] text-[17px] h-[45px] text-[var(--foreground)] flex items-center hover:bg-[var(--bgCol)] justify-between w-[100%] px-[20px] ">
                                    <div className="items-center flex gap-[10px] text-ellipsis overflow-hidden">
                                        <Github /> {userDetails?.name}
                                    </div>
                                    <ChevronDown />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-[var(--background)] flex flex-col p-[5px] gap-[5px]">
                                <Button variant="ghost" className="justify-start text-[var(--foreground)]/80 font-[400] outline-none" onClick={() => { signOut({ callbackUrl: "/login" }) }}>
                                    <Users /> Switch account
                                </Button>
                                <Button variant="ghost" className="justify-start text-[red]/100 hover:text-[red] outline-none" onClick={() => { signOut({ callbackUrl: "/" }) }}>
                                    <LogOut /> Signout
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="text-right w-[fit-content]">
                        <p className="text-[15px] px-[10px]"><span className="text-[#ec4927] font-[500]">{userDetails?.tokens}</span> <span className="opacity-[0.7] text-[12px]">tokens / day</span></p>
                    </div>
                </div>}

            {!selectedRepo &&
                <div className="flex gap-[10px] items-center">
                    <Input spellCheck={false} className="rounded-[6px]" placeholder="Or paste public url" disabled={checkingUrlLoader} ref={urlInputRef} />

                    <Button loading={checkingUrlLoader} onClick={async () => {
                        if (!urlInputRef.current?.value.trim()) return;
                        setcheckingUrlLoader(true);
                        const repo = await getRepoDetails(urlInputRef.current.value.trim());
                        if (!repo) {
                            toast('Repo not found', {
                                position: "top-left",
                                autoClose: 1500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                                transition: Bounce,
                            });
                            urlInputRef.current.value = ""
                        }
                        else {
                            setSelectedRepo(repo);
                            const branches = await getBranches(repo.owner.login, repo.name);
                            setSelectedBranch(branches.find((b: any) => b.name === repo.default_branch));
                            if (session)
                                setRepoBranches(branches);
                        }
                        setcheckingUrlLoader(false);
                    }}>
                        <Search />
                    </Button>
                </div>}



            {selectedRepo && <div className={styles.selectedRepoDiv}>
                

                <div className={`flex items-center gap-[10px] justify-between text-[16px] h-[45px] pl-[10px] hover:bg-[var(--bgCol2)] rounded-[7px] transition-all duration-200 ${styles.repoItemDiv}`}>
                    <div className="flex flex-1 justify-between items-center gap-[10px]">
                        <div className="flex flex-1 items-center gap-[10px]">
                            <div className="min-w-[16px]">
                                <GithubIcon className="h-[16px] w-[16px]" />
                            </div>
                            <div className="w-[100%] h-[1.5em] overflow-hidden relative">
                                <div className="absolute w-[100%] text-ellipsis whitespace-nowrap">{selectedRepo.name}</div>
                            </div>
                        </div>

                        <div className="flex gap-[10px items-center] gap-[5px]">
                            {selectedRepo.visibility == "private" &&
                                <Lock size={16} className="opacity-[0.4]" />
                            }

                            <p className="text-[12px] opacity-[0.4] whitespace-nowrap inline-block">
                                {timeAgo(selectedRepo.updated_at)}
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => {
                        setSelectedRepo(null);
                        setSelectedBranch(null);
                        setRepoBranches(null);
                    }} className="h-[35px] w-[100px]">
                        Cancel
                    </Button>

                </div>
            </div>}


            {!selectedRepo &&
                <ScrollArea className="h-[370px] rounded-[10px] border-[1px] border-[var(--foreground)]/20 p-[10px]">

                    <div className="bg-[var(--background)] rounded-[10px] flex flex-col gap-[5px] transition-all duration-300 ease-in-out">

                        {userRepos && !selectedRepo && userRepos.map((repo, index) => (<div key={index}>
                            {index > 0 &&
                                <div className="w-[100%] h-[1px] bg-[linear-gradient(to_right,transparent,var(--secondary),transparent)]"></div>
                            }

                            <div className={`flex items-center gap-[10px] justify-between text-[16px] h-[45px] pl-[10px] hover:bg-[var(--bgCol2)] rounded-[7px] transition-all duration-200 ${styles.repoItemDiv}`}>
                                <div className="flex flex-1 justify-between items-center gap-[10px]">
                                    <div className="flex flex-1 items-center gap-[10px]">
                                        <div className="min-w-[16px]">
                                            <GithubIcon className="h-[16px] w-[16px]" />
                                        </div>
                                        <div className="w-[100%] h-[1.5em] overflow-hidden relative">
                                            <div className="absolute w-[100%] text-ellipsis whitespace-nowrap">{repo.name}</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-[10px items-center] gap-[5px]">
                                        {repo.visibility == "private" &&
                                            <Lock size={16} className="opacity-[0.4]" />
                                        }

                                        <p className="text-[12px] opacity-[0.4] whitespace-nowrap inline-block">
                                            {timeAgo(repo.updated_at)}
                                        </p>
                                    </div>
                                </div>
                                <Button onClick={async () => {
                                    setSelectedRepo(repo);
                                    const branches = await getBranches(repo.owner.login, repo.name);
                                    setSelectedBranch(branches.find((b: any) => b.name === repo.default_branch));
                                    setRepoBranches(branches);
                                }} className="h-[35px] w-[100px]">
                                    Select
                                </Button>
                            </div>
                        </div>))}
                    </div>
                </ScrollArea>}

            {selectedRepo &&
                <div className="w-[100%] mt-[10px] px-[10px] md:mt-[auto] my-[auto] flex flex-col gap-[10px]">
                    <div className="flex justify-between gap-[20px] items-center">
                        <h1 className="text-[16px] flex items-center gap-[15px]"><FileCheck2 size={14} /> Auto push when done</h1>
                        <Switch checked={autoUpdateReadme && session?.user.login == selectedRepo.owner.login} onCheckedChange={setAutoUpdateReadme} disabled={session?.user.login != selectedRepo.owner.login} />
                    </div>

                    <div className="flex gap-[20px] justify-between items-center">
                        <h1 className="text-[16px] flex items-center gap-[15px]">
                            <GitBranch size={14} />
                            Branch</h1>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[120px]">
                                    {!selectedBranch && <LoaderCircle className="m-auto animate-spin" size={22} />}
                                    {selectedBranch?.name}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent asChild>
                                <div className="p-[5px] w-[120px]">
                                    {!repoBranches && <LoaderCircle className="m-auto animate-spin" size={22} />}
                                    {repoBranches?.map((branch, index) => (
                                        <PopoverClose key={index} asChild>
                                            <Button variant="ghost" className="w-[100%]" onClick={() => {
                                                setSelectedBranch(branch);
                                            }}>{branch.name}</Button>
                                        </PopoverClose>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>}
        </div>



        {false && <div className="flex-1 min-w-[300px] flex flex-col gap-[20px] p-2 mt-[10px]">
            <h1 className="text-[30px]">
                Choose Platform
            </h1>
            <div className="w-[100%] flex flex-wrap gap-[10px]">
                <div className={`${styles.socialImgHolder} ${socialCard.includes(1) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(1) && "opacity-[0.4]"}`} onClick={() => {
                    toggleCard(1);
                }}>
                    <Image src={githubBanner} alt="" className="rounded-[10px] object-cover h-[100%] w-[100%]" unoptimized />

                </div>

                <div className={`${styles.socialImgHolder} ${socialCard.includes(2) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(2) && "opacity-[0.4]"}`} onClick={() => {
                    return
                    toggleCard(2);
                }}>
                    <Image src={xBanner} alt="" className="rounded-[10px] object-cover h-[100%] w-[100%]" unoptimized />


                </div>

                <div className={`${styles.socialImgHolder} ${socialCard.includes(3) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(3) && "opacity-[0.4]"}`} onClick={() => {
                    return
                    toggleCard(3);
                }}>
                    <Image src={artisticBg} className="absolute z-[-1] top-0 left-0 h-[100%] w-[100%] object-cover rounded-[10px]" alt="" unoptimized />
                    <Image src={bugspotBanner} className="absolute z-[1] h-[30px] w-[100%] object-contain " alt="" unoptimized />

                </div>

                <div className={`${styles.socialImgHolder} ${socialCard.includes(4) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(4) && "opacity-[0.4]"}`} onClick={() => {
                    return
                    toggleCard(4);
                }}>
                    <Image src={linkedInBanner} className="h-[100%] w-[100%] object-cover rounded-[10px]" alt="" unoptimized />

                </div>
            </div>
            <p className="text-center text-[15px] opacity-[0.5]">Social posts comming soon</p>
        </div>}

        {tokensNeeded && userDetails &&
            <div className={styles.tokensDiv}>

                <div className="flex flex-col gap-[5px] items-center">
                    <p className="opacity-[0.7]">Tokens needed</p>
                    {!loadingTree ?
                        <NumberTicker
                            value={tokensNeeded}
                            className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white" />
                        : <><LoaderCircle size={40} className="animate-spin" /></>}
                    <div className="mt-[20px]">
                        <p><span className="opacity-[0.7]">You have</span> {userDetails?.tokens} <span className="opacity-[0.7]">tokens</span></p>
                    </div>

                    {tokensNeeded > 100000 ? <div>
                        <p className="text-[red]">One repository can not exceed 100K tokens</p>
                    </div> :
                        <div className="mt-[20px] flex flex-col gap-[10px] w-[100%] max-w-[300px] ">
                            <Button disabled={loadingTree || (tokensNeeded > userDetails.tokens)} className="text-[white] bg-[#ec4927] hover:bg-[#FA4F2D]" onClick={() => {
                                if (!session || !selectedBranch) return;
                                setLoadingTree(true);
                                setDashboardScreen("loading");
                                setTimeout(() => {
                                    initiateMakingContent();
                                }, 0);
                            }}>
                                Proceed
                            </Button>
                            <Button variant="outline" onClick={() => {
                                setSelectedBranch(null);
                                setSelectedRepo(null);
                                setTokensNeeded(null);
                                setRepoBranches(null);
                            }}>
                                Cancel
                            </Button>
                        </div>
                    }

                </div>

            </div>
        }

    </div >
    </>
}