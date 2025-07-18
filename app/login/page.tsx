"use client"
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (<div className="pt-[60px] px-[10px] flex flex-col items-center font-[Poppins] h-[100vh] justify-center relative">
        <BackgroundBeams className="z-[-1] absolute h-[100%] w-[100%]" />

        <div className="h-[300px] flex flex-col gap-[50px] items-center">
            <h1 className="text-[30px]">Signin to your Gitfull account</h1>
            <Button className="w-[200px]" onClick={() => {
                signIn("github", { callbackUrl: "/dashboard" })
            }}>
                <GithubIcon />  Signin with github
            </Button>
        </div>
    </div>)
}