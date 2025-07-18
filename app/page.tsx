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

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();




  return (
    <>
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

      </div>
    </>
  )
}
