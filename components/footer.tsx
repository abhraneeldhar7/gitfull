"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
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
                <h1 className="font-medium text-3xl sm:text-4xl">Connect</h1>
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
