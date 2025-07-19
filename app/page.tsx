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


import nextjsLogo from "../public/frameworkLogos/nextjs_gyqxdo.png"
import reactLogo from "../public/frameworkLogos/React-icon.svg.png"
import fastApiLogo from "../public/frameworkLogos/FastAPI_prcozs.png"
import flutterLogo from "../public/frameworkLogos/flutter.png"
import Link from "next/link";
import { ArrowUpRight, Dot } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const { theme } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0)

  const readmeData = [{
    title: "Lazy Ping",
    thumbnail: "https://github.com/abhraneeldhar7/lazy-ping/raw/master/public/assets/landingPage-d9ac",
    description: "Lazy Ping aims to provide a simple and efficient way to check the status of multiple endpoints, helping developers and teams ensure their APIs are functioning correctly. This project is ideal for developers, DevOps teams, and anyone responsible for maintaining API endpoints.",
    keyFeatures: {
      h1: "Core Features",
      p1: ["Endpoint Management: Add, edit, and delete API endpoints to monitor.", "Automated Pinging: Endpoints are pinged at regular intervals to check their status."],
      h2: "User Interface",
      p2: ["Dashboard: A user-friendly dashboard to view and manage all endpoints.", "Project Management: Organize endpoints by projects for better management."]
    },
    ownerPic: "https://avatars.githubusercontent.com/u/89008279?v=4",
    ownerName: "Abhra the Neel",
    ownerBio: "Full-stack developer with expertise in web, Android, and server-side development. Most projects are private due to being production code.",
    repoUrl: "https://github.com/abhraneeldhar7/lazy-ping?tab=readme-ov-file",
    repoName: "lazyPing",
    folderStructure: "/landingPage/lazyPing-FS",
    techStack: [
      "/landingPage/badge/nextjs.svg",

      "/landingPage/badge/supabase.svg",

      "/landingPage/badge/tailwind.svg",

      "/landingPage/badge/nextauth.svg"
    ]
  },
  {
    title: "Blastro",
    thumbnail: "https://github.com/Xeven777/blastro/raw/master/public/opengraph-image.jpg",
    description: "Blastro is a modern Astro-based website built for showcasing blog posts and providing a clean, user-friendly experience. It leverages TypeScript, Tailwind CSS, and Astro's powerful features to create a fast and efficient platform for content presentation.",
    keyFeatures: {
      h1: "🎨 Blog Post Display",
      p1: ["Displays blog posts with titles, excerpts, and images.", "Supports dynamic routing for individual blog posts.",],
      h2: "⚙️ Content Management",
      p2: ["Uses Astro's content feature for easy blog post management.", "Supports MDX for mixing JavaScript and JSX within Markdown."]
    },
    ownerPic: "https://avatars.githubusercontent.com/u/115650165?v=4",
    ownerName: "Anish",
    ownerBio: "♦️Learning. Growing. Blooming✨ | Passionate developer with a love for problem-solving , efficient and creative thinking 🔥💫",
    repoUrl: "https://github.com/Xeven777/blastro",
    repoName: "blastro",
    folderStructure: "/landingPage/blastro-FS",
    techStack: [
      "/landingPage/badge/nextjs.svg",

      "/landingPage/badge/supabase.svg",

      "/landingPage/badge/tailwind.svg",

      "/landingPage/badge/nextauth.svg"
    ]
  }
  ]


  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true)
    if (!readmeData || readmeData.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 1 >= readmeData.length ? 0 : prevIndex + 1
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className={styles.main}>
        {/* <BackgroundBeams className="z-[-1] absolute h-[100%] w-[100%]" /> */}
        <Image src={gradientBg} className="top-0 left-0 absolute w-[100%] h-[100%] z-[-2] opacity-[0.1] invert dark:opacity-[0.2] dark:filter-none object-cover" alt="" />
        <div className={styles.heroDiv}>
          <div className="flex-1 flex flex-col gap-[20px]">
            <h1 className={styles.heroTitle}>
              <span className={styles.textGradient}>Turn your</span> <span className="text-[#f9411c]">git</span> <span className={styles.textGradient}>repos into social media engagement</span></h1>

            <Button className={styles.heroBtn}>
              <Link href="/login">
                Start hacking
              </Link>
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


        <div className="min-h-[500px] mt-[50px] px-[20px]">

          <h1 className={styles.sectionTitle}>
            One Click Everything
          </h1>
          <div className="flex flex-col gap-[20px]">


            <div className="flex gap-[20px] flex-wrap mt-[20px]">
              <div className="flex-1 flex flex-col gap-[10px] min-w-[300px]">
                <div className={styles.readmeFadeinDiv}>
                  <h1 className="text-[30px]">{readmeData[currentIndex].title}</h1>
                </div>
                <div className={styles.readmeFadeinDiv}>
                  <Image src={readmeData[currentIndex].thumbnail} className="rounded-[6px] w-[100%] object-contain h-[100%] shadow-md h-[250px]" height={300} width={400} alt="" unoptimized />
                </div>
                <div className={`flex flex-col gap-[6px] mt-[15px] ${styles.readmeFadeinDiv}`}>
                  <h2 className="text-[22px]">🗂️ Description</h2>
                  <p className="text-[14px]">{readmeData[currentIndex].description}</p>
                </div>
              </div>

              <div className="flex-2 flex flex-col gap-[20px]">

                <div className="flex gap-[20px] flex-wrap">
                  <div className={`flex-1 min-w-[300px] h-[300px] ${styles.readmeFadeinDiv}`}>
                    <h2 className="text-[22px]">✨ Key Features</h2>
                    <div className="mt-[15px] pl-[10px]">
                      <p className="text-[20px]">{readmeData[currentIndex].keyFeatures.h1}</p>
                      <div className="text-[14px] flex flex-col gap-[5px] mt-[5px]">
                        <p className="flex"><Dot />{readmeData[currentIndex].keyFeatures.p1[0]}</p>
                        <p className="flex"><Dot />{readmeData[currentIndex].keyFeatures.p1[1]}</p>
                      </div>
                      <p className="text-[20px] mt-[10px]">{readmeData[currentIndex].keyFeatures.h2}</p>
                      <div className="text-[14px] flex flex-col gap-[5px] mt-[5px]">
                        <p className="flex"><Dot /> {readmeData[currentIndex].keyFeatures.p2[0]}</p>
                        <p className="flex"><Dot />{readmeData[currentIndex].keyFeatures.p2[1]}
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="flex-1 flex flex-col gap-[10px] items-center min-w-[200px] h-[300px] justify-center">
                    <div className={`flex flex-col gap-[10px] items-center ${styles.readmeFadeinDiv}`}>


                      <Image src={readmeData[currentIndex].ownerPic} height={120} width={120} alt="" unoptimized />

                      <h1 className="text-[20px]">{readmeData[currentIndex].ownerName}</h1>
                      <p className="text-[15px] text-center w-[100%]">{readmeData[0].ownerBio}</p>
                    </div>

                    <Link href={readmeData[currentIndex].repoUrl} target="_blank">
                      <Button className="w-[100px]">
                        Visit <ArrowUpRight />
                      </Button>
                    </Link>
                  </div>

                </div>

                <div className={styles.readmeFadeinDiv}>
                  {mounted &&
                    <Image src={`${readmeData[currentIndex].folderStructure}-${theme == "dark" ? "dark" : "light"}.png`} className="h-[200px] my-auto object-contain w-[100%] mx-auto shadow-md" width={500} height={300} alt="" unoptimized />
                  }
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-[6px] justify-center">
              {readmeData[currentIndex].techStack.map((ts, index) => (
                <Image key={index} src={ts} height={20} width={100} alt="" unoptimized />
              ))}
            </div>
          </div>


          <div className={styles.worksWithDiv}>
            <h1 className={styles.sectionTitle}>Works with</h1>
            <div className={styles.frameworkLogoHolder}>

              <div className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
                <Image src={nextjsLogo} alt="" unoptimized />
              </div>
              <div className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
                <Image src={reactLogo} alt="" unoptimized />
              </div>
              <div className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
                <Image className="rounded-[50%]" src={fastApiLogo} alt="" unoptimized />
              </div>
              <div className={`${styles.frameworkItem} rounded-[5px] hover:bg-[var(--foreground)]/10`}>
                <Image src={flutterLogo} alt="" unoptimized />
              </div>

            </div>
          </div>


        </div>

      </div >
    </>
  )
}
