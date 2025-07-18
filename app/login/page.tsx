"use client"
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import gradientBg from "../../public/artistic-blurry-colorful-wallpaper-background.jpg"


export default function LoginPage() {
    return (<div className="pt-[60px] px-[10px] flex flex-col items-center font-[Poppins] h-[100vh] justify-center relative">
        <Image src={gradientBg} className="top-0 left-0 absolute w-[100%] h-[100%] z-[-2] opacity-[0.2] invert dark:opacity-[0.2] dark:filter-none object-cover" alt="" />

        <BackgroundBeams className="z-[-1] absolute h-[100%] w-[100%]" />

        <div className="h-[300px] flex flex-col gap-[50px] items-center">
            <h1 className="text-[30px] px-[20px] text-center">Signin to your Gitfull account</h1>
            <Button className="w-[200px]" onClick={() => {
                signIn("github", { callbackUrl: "/dashboard" })
            }}>
                <GithubIcon />  Signin with github
            </Button>
        </div>
    </div>)
}