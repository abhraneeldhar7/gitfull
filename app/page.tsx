"use client"
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

import styles from "./root.module.css"
import gradientBg from "../public/artistic-blurry-colorful-wallpaper-background.jpg"
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import TwitterCard from "@/components/socialCards/twitter/twitterCard";
import LinkedinCard from "@/components/socialCards/linkedin/linkedin";
import BugspotCard from "@/components/socialCards/bugspot/bugspotCard";
import Link from "next/link";
import { Dot } from "lucide-react";
import { useEffect, useState } from "react";


import nextjsLogo from "../public/frameworkLogos/nextjs_gyqxdo.png"
import reactLogo from "../public/frameworkLogos/React-icon.svg.png"
import fastApiLogo from "../public/frameworkLogos/FastAPI_prcozs.png"
import flutterLogo from "../public/frameworkLogos/flutter.png"

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const [gitFiles, setGitFiles] = useState<string[]>(
    Array(7).fill("")
  );
  const fileNames = [
    "components/ui/button.tsx",
    "components/ui/input.tsx",
    "components/ui/checkbox.tsx",
    "components/ui/avatar.tsx",
    "components/ui/select.tsx",
    "components/ui/dialog.tsx",
    "components/ui/switch.tsx",
    "components/ui/slider.tsx",
    "components/dashboard/navbar.tsx",
    "components/dashboard/sidebar.tsx",
    "components/dashboard/footer.tsx",
    "lib/utils.ts",
    "lib/constants.ts",
    "lib/hooks/useTheme.ts",
    "lib/hooks/useDebounce.ts",
    "pages/index.tsx",
    "pages/about.tsx",
    "pages/contact.tsx",
    "pages/api/route.ts",
    "pages/api/user.ts",
    "app/layout.tsx",
    "app/globals.css",
    "app/providers.tsx",
    "styles/theme.css",
    "styles/tokens.css"
  ];
  useEffect(() => {
    const updateFiles = () => {
      const newFiles = Array(7)
        .fill("")
        .map(() => {
          const randIndex = Math.floor(Math.random() * fileNames.length);
          return fileNames[randIndex];
        });
      setGitFiles(newFiles);
    };

    updateFiles();
    const interval = setInterval(updateFiles, 100);
    return () => clearInterval(interval);
  }, []);




  const longCodeSnippet = `
 import Image from "next/image"
import styles from "./landingpage.module.css"
import { TextAnimate } from "../magicui/text-animate"
import { Meteors } from "../magicui/meteors"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowUpRight, Briefcase, ChevronRight, CircleCheckBig, FileX, ListX, LoaderCircle, UserMinus, UserX } from "lucide-react"
import { NumberTicker } from "../magicui/number-ticker"
import { getTotalProjects, getTotalUsers } from "@/app/actions/mongoFunctions"
import Footer from "../footer/footer"
import CardStackSection from "./stackedCards/stackedCards"
import onlyLogo from "../../public/onlyLogo.png"
import OrgForm from "./orgForm/orgForm"
import Profilepopover from "../profilePopover/profilePopover"
import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"

export default async function LandingpageComponent() {
    const usersNumber = await getTotalUsers();
    const projectsNumber = await getTotalProjects();

    const session = await getServerSession(options);
    return (<>
        <div className={styles.main}>

            <Image src="https://res.cloudinary.com/dytynwrxu/image/upload/v1751664413/artistic-blurry-colorful-wallpaper-background_w1tomo.jpg" height={10} width={10} alt="" className="absolute top-0 left-0 h-[120vh] w-[100vw] z-[-1] object-cover" />
            <div className={styles.navBar}>
                <div className={styles.logoDiv}>
                    <Image src={onlyLogo} className="object-contain w-[fit-content]" alt="" />
                </div>
            
                    {!session && <Link href="/login"><Button variant="outline">Log in</Button></Link>}
                </div>
            </div>

                <div className="flex flex-col items-center gap-[25px]">
                    <h1 className={styles.heroText}>Build your Dream <span>Team</span> for your Dream <span>Project</span></h1>
                    <TextAnimate className={styles.heroDesc} >
                        The Go-to network for team building
                    </TextAnimate>

                    <div className={styles.heroBtnDiv}>
                        <Link href="/login" className={styles.getStartedBtn}>
                            Get started <ChevronRight size={24} />
                        </Link>
                    </div>

                <div className={styles.siteStatsDiv}>
                    <Link href="/bugwall" className={styles.siteStatHolder}>
                        <NumberTicker value={usersNumber} className="text-2xl" />
                        <p>Members</p>
                    </Link>
                    <Link href="/projects" className={styles.siteStatHolder}>
                        <NumberTicker value={projectsNumber} className="text-2xl" />
                        <p>Active Projects</p>
                    </Link>
                    <div className={styles.siteStatHolder}>
                        <NumberTicker value={100} className="text-2xl" />
                        <p>Live Events</p>
                    </div>
                </div>
            </div>

            <div>
                <p className="text-[14px] text-center opacity-[0.4]">Flashbang 
            </div>

            <div className="bg-[#0e0e0e] z-[3] pt-[10px]" >
                <p id="my-org" className="text-[14px] text-center opacity-[0.4]">Coded in India</p>
                <div className="mt-[40px] mb-[70px] flex justify-center w-[100%] px-[10px]">
                    <OrgForm />
                </div>
            </div>

            <div className={styles.versionAnnouncementDiv}>
                <h1>Welcome to Bugspot <span>V2</span></h1>
                <p className="text-[19px] opacity-[0.9] px-[10px]">Bugspot V1 has it's moments but to push it to <span>V2</span> we need alliance. We're seeking strategic investors and venture capitalists to help scale a platform that's redefining how developers connect, collaborate, and grow.
                </p>

                <div className="flex gap-[10px] mx-auto mt-[20px]">
                    <Link href="https://x.com/abhraneeldhar" target="_blank">
                    <Link href="mailto:abhraneeldhar@gmail.com" target="_blank">
  `.trim();

  const codeLines = longCodeSnippet.split('\n');
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentLine(prev => {
          if (prev >= codeLines.length - 10) {
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, codeLines.length]);

  const visibleLines = codeLines.slice(currentLine, currentLine + 20);




  return (
    <div className={styles.main}>
      <BackgroundBeams className="z-[-1] absolute h-[100%] w-[100%]" />
      <Image src={gradientBg} className="top-0 left-0 absolute w-[100%] h-[100%] z-[-2] opacity-[0.2] invert dark:opacity-[0.2] dark:filter-none object-cover" alt="" />
      <div className={styles.heroDiv}>
        <div className="flex-1 flex flex-col gap-[20px]">
          <h1 className={styles.heroTitle}>
            <span className={styles.textGradient}>Turn your</span> <span className="text-[#f9411c]">git</span> <span className={styles.textGradient}>repos into social media engagement</span></h1>

          <Button className={styles.heroBtn} onClick={() => {
            if (session) {
              router.push("/readme");
            }
            else {
              signIn("github");
            }
          }}>
            Start hacking
          </Button>

        </div>

        <div className={styles.heroImgDiv}>


          <div className={styles.heroCard1}>
            <LinkedinCard />
          </div>

          <div className={styles.heroCard2}>
            <BugspotCard blogData={{
              blogId: "",
              ownerId: "107727811528334796477",
              ownerName: "Abhraneel",
              blogTextContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates magni nostrum ullam dolorum corrupti error? Repellendus veniam dignissimos quos consectetur!",
              blogTitle: "New AI App",
              likes: [],
              bookmarks: 0,
              analyticsNumber: 0,
              commentsNumber: 0,
              tags: [],
              thumbnailUrl: "https://res.cloudinary.com/dytynwrxu/image/upload/v1751995102/blogThumbnails/c04338b9-6562-4523-b0a7-41af564c4b62.jpg",
              viewStatus: "public",
              createdAt: 0,
              lastEditTime: 0,
              updatedAt: 0,
            }} />
          </div>

          <div className={styles.heroCard3}>
            <TwitterCard />
          </div>
        </div>

      </div>


      <div className="min-h-[500px] mt-[50px]">

        <h1 className={styles.sectionTitle}>
          Not your average gpt wrapper
        </h1>


        <div className={styles.exampleDiv}>
          <div className={styles.repoFiles}>
            {gitFiles.map((file, idx) => (
              <div key={idx}>
                {idx > 0 &&
                  <div className={styles.divider}></div>
                }
                <p>{file}</p>
              </div>
            ))}
          </div>
          <div className="w-[100%] max-w-[500px] bg-[var(--githubBg)]/40 border border-[1px] border-[var(--foreground)]/30 px-[20px] py-[10px] rounded-[20px] backdrop-blur-[40px] font-[Satoshi] font-[600]text-[var(--foreground)] pb-[20px] flex-2 z-[2]">
            <h1 className="text-[30px]">Gitfull Repository</h1>

            <hr className="my-[10px]" />

            <h2 className="text-[29px] flex gap-[5px] items-center"><span className="text-[20px]">🌟</span> Features</h2>
            <p className="ml-[25px] text-[18px] flex items-center"><Dot />In detail readme.md</p>
            <p className="ml-[25px] text-[18px] flex items-center"><Dot />Instant post generator</p>
            <p className="ml-[25px] text-[18px] flex items-center"><Dot />One click article writer</p>

            <h2 className="text-[29px]  flex gap-[5px] items-center mt-[10px]"><span className="text-[20px]">💻</span> Tech Stack</h2>
            <p className="ml-[25px] text-[18px] flex items-center"><Dot />NextJs</p>
            <p className="ml-[25px] text-[18px] flex items-center"><Dot />Tailwind</p>
            <p className="ml-[25px] text-[18px] flex items-center"><Dot />MongoDB</p>

            <hr className="my-[10px] mt-[20px]" />
            <h2 className="text-[29px]  flex gap-[5px] items-center mt-[10px]">Support</h2>
            <Link href="https://x.com/abhraneeldhar" target="_blank">
              <p className="bg-[var(--background)] rounded-[6px] py-[10px] px-[20px] mt-[10px] border border-[1px] border-[var(--foreground)]/20">https://x.com/abhraneeldhar</p>
            </Link>


          </div>

          <div className={styles.editorBoxDiv}>
            <pre>
              {visibleLines.map((line, index) => (
                <div key={index}>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        </div>


        <div className={styles.worksWithDiv}>
          <h1 className={styles.sectionTitle}>Works with</h1>
          <div className={styles.frameworkLogoHolder}>

            <div className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
              <Image src={nextjsLogo} alt="" unoptimized/>
            </div>
            <div  className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
              <Image src={reactLogo} alt="" unoptimized/>
            </div>
            <div  className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
              <Image className="rounded-[50%]" src={fastApiLogo} alt="" unoptimized/>
            </div>
            <div  className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
              <Image src={flutterLogo} alt="" unoptimized />
            </div>

          </div>
        </div>


      </div>

    </div>
  )
}
