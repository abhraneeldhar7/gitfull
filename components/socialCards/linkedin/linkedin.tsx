import Image from "next/image"
import styles from "./linkedin.module.css"
import { AlignVerticalJustifyStartIcon, Bookmark, Cross, Dot, Earth, EllipsisIcon, Heart, LucideReceiptPoundSterling, MessageCircle, WholeWord, X } from "lucide-react"
export default function LinkedinCard() {
    return (<div className={`${styles.cardMain} border border-[1px] border-[var(--foreground)]/30`}>
        <EllipsisIcon size={20} className="absolute right-[45px] top-[7px] opacity-[0.5]" />
        <X size={20} className="absolute right-[10px] top-[7px] opacity-[0.5]" />


        <div className="flex gap-[12px]">
            <div className="w-[40px]">
                <Image src="/socialCards/elliot.jpg" width={40} height={40} alt="" className="min-w-[40px] h-[40px] rounded-[50%]" unoptimized />
            </div>
            <div className="flex flex-col gap-[3px]">
                <div className="flex gap-[2px] items-center">
                    <h1 className="text-[17px] leading-[1em]">Elliot Alderson</h1>
                    <Dot className="opacity-[0.7]" size={14} />
                    <p className="text-[12px] opacity-[0.7]">2nd</p>
                </div>
                <p className="text-[12px] opacity-[0.7] leading-[1em]">Cyber Sec. at Evil Corp</p>
                <p className="text-[11px] flex items-center mt-[2px] opacity-[0.8]">1w <Dot size={14} /> <Earth size={12} /></p>
            </div>
        </div>
        <div className="flex flex-col gap-[5px]">
            <div className="text-[15px]">Just created a 30-second fix to the most annoying dev problem. It pings your free-tier backend so it never sleeps.
                No auth. No database. Just paste your URL.
                Here's how it works 👇</div>


        </div>
    </div>)
}