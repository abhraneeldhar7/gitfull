"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";

export default function Footer() {

    const { theme, setTheme } = useTheme();

    return (
        <div className="bg-[var(--background)] text-[var(--foreground)]/90 px-5 pb-8 pt-2 w-full font-poppins flex flex-col">
            <div className="flex justify-between items-start flex-wrap">
                <div className="flex flex-col mt-1 space-y-1">
                    <Link href="https://github.com/abhraneeldhar7/lazy-ping" className="flex items-center gap-1" target="_blank">
                        Open Source <ArrowUpRight size={14} />
                    </Link>
                    {/* <Link href="/updates" className="flex items-center gap-1">
                        Updates <ArrowUpRight size={14} />
                    </Link> */}
                    <Link href="https://abhraneeldhar.vercel.app" target="_blank" className="flex items-center gap-1" popoverTarget="_blank">
                        Contact <ArrowUpRight size={14} />
                    </Link>

                </div>
                <div className="flex flex-col gap-[20px] items-end">
                    <h1 className="font-medium text-3xl sm:text-4xl">Connect</h1>
                    <div className="flex gap-[10px] items-center">
                        <Sun className="opacity-[0.6]" size={16} />
                        <Switch checked={theme == "dark"} onCheckedChange={(e) => {
                            if (e) {
                                setTheme("dark");
                            } else {
                                setTheme("light")
                            }
                        }} />
                        <Moon className="opacity-[0.6]" size={16} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-0">
                    <Image
                        src="https://res.cloudinary.com/dytynwrxu/image/upload/v1746966995/signatureLogoSimpleTransparent_lhf4dp.png"
                        width={90}
                        height={90}
                        alt="logo"
                        className="sm:w-[90px] sm:h-[90px] w-[70px] h-[70px] object-contain dark:invert"
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
}
