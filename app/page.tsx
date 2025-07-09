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

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className={styles.main}>
      <BackgroundBeams className="z-[-1] absolute h-[100%]" />
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


        <div className="flex justify-center mt-[50px] px-[10px]">


          <div className="w-[100%] max-w-[500px] bg-[var(--githubBg)]/40 border border-[1px] border-[var(--foreground)]/30 px-[20px] py-[10px] rounded-[20px] backdrop-blur-[5px] font-[Satoshi] font-[600]text-[var(--foreground)] pb-[20px]">
            <h1 className="text-[30px]">Gitfull Repository</h1>

            <hr className="my-[10px]" />

            <h2 className="text-[29px] flex gap-[5px] items-center"><span className="text-[20px]">🌟</span> Features</h2>
            <p className="ml-[50px] text-[18px]">In detail readme.md</p>
            <p className="ml-[50px] text-[18px]">Instant post generator</p>
            <p className="ml-[50px] text-[18px]">One click article writer</p>

            <h2 className="text-[29px]  flex gap-[5px] items-center mt-[10px]"><span className="text-[20px]">💻</span> Tech Stack</h2>
            <p className="ml-[50px] text-[18px]">NextJs</p>
            <p className="ml-[50px] text-[18px]">Tailwind</p>
            <p className="ml-[50px] text-[18px]">MongoDB</p>

            <hr className="my-[10px] mt-[20px]" />
            <h2 className="text-[29px]  flex gap-[5px] items-center mt-[10px]">Support</h2>
            <Link href="https://x.com/abhraneeldhar" target="_blank">
              <p className="bg-[var(--background)] rounded-[6px] py-[10px] px-[20px] mt-[10px] border border-[1px] border-[var(--foreground)]/20">https://x.com/abhraneeldhar</p>
            </Link>


          </div>

        </div>

      </div>

    </div>
  )
}
