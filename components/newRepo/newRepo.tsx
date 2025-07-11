"use client"
import { Check, CheckSquare, ChevronDown, ChevronRight, Github, GithubIcon, Lock, LogOut, Users } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import styles from "./nreRepo.module.css"
import { useEffect, useState } from "react"
import { getRepos } from "@/app/actions/githubApiCalls"
import { timeAgo } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import Image from "next/image"

import githubBanner from "../../public/banners/githubBanner.webp"
import xBanner from "../../public/banners/xBanner.avif"
import bugspotBanner from "../../public/banners/darkmode.png"
import artisticBg from "../../public/banners/artistic-blurry-colorful-wallpaper-background.jpg"
import linkedInBanner from "../../public/banners/linkedinBanner.png"




export default function NewRepo() {

    const [userRepos, setUserRepos] = useState<any[] | null>(null)
    useEffect(() => {
        const a = async () => {
            const repos = await getRepos();
            console.log(repos);
            setUserRepos(repos)
        }
        a();
    }, [])

    const [selectedRepo, setSelectedRepo] = useState<any | null>(null)
    const [socialCard, setSocialCard] = useState<number[]>([]);
    const toggleCard = (index: number) => {
        setSocialCard((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    useEffect(() => {
        console.log(socialCard)
    }, [socialCard])

    return (<div className={styles.main}>
        <div className="flex-1 flex flex-col gap-[30px] flex-1 p-5 rounded-[10px] border-[1px] border-[var(--foreground)]/10 bg-[var(--bgCol)] min-w-[350px] h-[fit-content]">
            <h1 className="text-[30px]">Select your Repository</h1>
            <div className="flex gap-[10px] items-center">

                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="bg-[var(--background)] border border-[1px] border-[var(--secondary)] text-[17px] h-[45px] text-[var(--foreground)] flex items-center hover:bg-[var(--bgCol)] justify-start flex-1 px-[20px]">
                            <Github /> abhraneeldhar <ChevronDown />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-[var(--background)] flex flex-col p-[5px] gap-[5px]">
                        <Button variant="ghost" className="justify-start text-[var(--foreground)]/80 font-[400] outline-none">
                            <Users /> Switch account
                        </Button>
                        <Button variant="ghost" className="justify-start text-[red]/70 hover:text-[red] outline-none">
                            <LogOut /> Signout
                        </Button>
                    </PopoverContent>
                </Popover>
                <Button disabled={!selectedRepo} className="h-[45px] flex-1">
                    Readme <ChevronRight />
                </Button>
            </div>


            {selectedRepo && <>
                <div className="flex items-center gap-[10px] justify-between text-[16px] h-[45px] px-[15px] pr-[5px] hover:bg-[var(--bgCol2)] rounded-[7px] transition-all duration-200" >
                    <div className="flex items-center gap-[10px]">
                        <GithubIcon size={16} />
                        <p className="overflow-x-hidden max-w-[300px]">{selectedRepo.name}</p>


                        {selectedRepo.visibility == "private" &&
                            <Lock size={16} className="opacity-[0.4]" />
                        }


                        <p className="text-[12px] opacity-[0.4]">
                            {timeAgo(selectedRepo.updated_at)}
                        </p>
                    </div>
                    <Button onClick={() => { setSelectedRepo(null) }} className="h-[35px] w-[100px]">
                        Cancel
                    </Button>
                </div>
            </>}


            {!selectedRepo &&
                <ScrollArea className="h-[399px] rounded-[10px] border-[1px] border-[var(--foreground)]/20 p-[0px]">

                    <div className="bg-[var(--background)] rounded-[10px] p-[10px] flex flex-col gap-[5px]  transition-all duration-400 ease-in-out">

                        {userRepos && !selectedRepo && userRepos.map((repo, index) => (<>
                            {index > 0 &&
                                <div className="w-[100%] h-[1px] bg-[linear-gradient(to_right,transparent,var(--secondary),transparent)]"></div>
                            }

                            <div className="flex items-center gap-[10px] justify-between text-[16px] h-[45px] px-[15px] pr-[5px] hover:bg-[var(--bgCol2)] rounded-[7px] transition-all duration-200" key={index}>
                                <div className="flex items-center gap-[10px]">
                                    <GithubIcon size={16} />
                                    <p className="overflow-x-hidden max-w-[300px]">{repo.name}</p>


                                    {repo.visibility == "private" &&
                                        <Lock size={16} className="opacity-[0.4]" />
                                    }


                                    <p className="text-[12px] opacity-[0.4]">
                                        {timeAgo(repo.updated_at)}
                                    </p>
                                </div>
                                <Button onClick={() => { setSelectedRepo(repo) }} className="h-[35px] w-[100px]">
                                    Select
                                </Button>
                            </div>


                        </>))}
                    </div>
                </ScrollArea>
            }
        </div>



        <div className="flex-1 min-w-[300px] flex flex-col gap-[20px] p-2">
            <h1 className="text-[30px]">
                Generate Content For
            </h1>
            <div className="w-[100%] flex flex-wrap gap-[10px]">
                <div className={`${styles.socialImgHolder} ${socialCard.includes(1) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(1) && "opacity-[0.4]"}`} onClick={() => {
                    toggleCard(1);
                }}>
                    <Image src={githubBanner} alt="" className="rounded-[10px] object-cover h-[100%] w-[100%]" unoptimized />
                    {socialCard.includes(1) &&
                        <CheckSquare className="absolute left-[10px] bottom-[10px]" size={22} />
                    }
                </div>

                <div className={`${styles.socialImgHolder} ${socialCard.includes(2) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(2) && "opacity-[0.4]"}`} onClick={() => {
                    toggleCard(2);
                }}>
                    <Image src={xBanner} alt="" className="rounded-[10px] object-cover h-[100%] w-[100%]" unoptimized />
                    {socialCard.includes(2) &&
                        <CheckSquare className="absolute left-[10px] bottom-[10px]" size={22} />
                    }
                </div>

                <div className={`${styles.socialImgHolder} ${socialCard.includes(3) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(3) && "opacity-[0.4]"}`} onClick={() => {
                    toggleCard(3);
                }}>
                    <Image src={artisticBg} className="absolute z-[-1] top-0 left-0 h-[100%] w-[100%] object-cover rounded-[10px]" alt="" unoptimized />
                    <Image src={bugspotBanner} className="absolute z-[1] h-[30px] w-[100%] object-contain " alt="" unoptimized />
                    {socialCard.includes(3) &&
                        <CheckSquare className="absolute left-[10px] bottom-[10px] z-[2]" size={22} />
                    }
                </div>

                <div className={`${styles.socialImgHolder} ${socialCard.includes(4) && "opacity-[1]"} ${socialCard.length && !socialCard.includes(4) && "opacity-[0.4]"}`} onClick={() => {
                    toggleCard(4);
                }}>
                    <Image src={linkedInBanner} className="h-[100%] w-[100%] object-cover rounded-[10px]" alt="" unoptimized />

                    {socialCard.includes(4) &&
                        <CheckSquare className="absolute left-[10px] bottom-[10px]" size={22} />
                    }
                </div>
            </div>
        </div>
    </div>)
}