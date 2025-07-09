"use client"
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

import styles from "./root.module.css"
import { useTheme } from "next-themes";
import gradientBg from "../public/artistic-blurry-colorful-wallpaper-background.jpg"
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";


export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.main}>
      <BackgroundBeams className="z-[-1] " />
      <Image src={gradientBg} className="top-0 left-0 absolute w-[100%] h-[100%] z-[-2] opacity-[0.1] dark:opacity-[0.15] object-cover" alt="" />
      <div className={styles.heroDiv}>
        <div className="flex-1 flex flex-col gap-[20px]">
          <h1>Turn your <span className="text-[#f9411c]">git</span> repos into social media engagement</h1>


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
          img here
        </div>
      </div>

      <Button onClick={() => {
        if (theme == "dark") {
          setTheme("light");
        }
        else {
          setTheme("dark")
        }
      }}>
        toggle theme
      </Button>


    </div>
  )
}
