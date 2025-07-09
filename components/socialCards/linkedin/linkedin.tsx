import Image from "next/image"
import styles from "./linkedin.module.css"
import { AlignVerticalJustifyStartIcon, Bookmark, Cross, Dot, Earth, EllipsisIcon, Heart, LucideReceiptPoundSterling, MessageCircle, WholeWord, X } from "lucide-react"
export default function LinkedinCard() {
    return (<div className={styles.cardMain}>
        <EllipsisIcon size={20} className="absolute right-[45px] top-[7px] opacity-[0.5]" />
        <X size={20} className="absolute right-[10px] top-[7px] opacity-[0.5]" />


        <div className="flex gap-[12px]">
            <div className="w-[40px]">
                <Image src="https://res.cloudinary.com/dytynwrxu/image/upload/profilePics/101428758399536600490.jpg?v=2025-07-09" width={40} height={40} alt="" className="min-w-[40px] h-[40px] rounded-[50%]" unoptimized />
            </div>
            <div className="flex flex-col gap-[2px]">
                <div className="flex gap-[2px] items-center">
                    <h1 className="text-[17px] leading-[1em]">Abhraneel</h1>
                    <Dot className="opacity-[0.7]" size={14} />
                    <p className="text-[12px] opacity-[0.7]">1st</p>
                </div>
                <p className="text-[12px] opacity-[0.7] leading-[1em]">Lorem ipsum dolor sit amet, consectetu</p>
                <p className="text-[11px] flex items-center mt-[2px] opacity-[0.8]">1w <Dot size={14} /> <Earth size={12} /></p>
            </div>
        </div>
        <div className="flex flex-col gap-[5px]">


            <div className="text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates magni nostrum ullam dolorum corrupti error? Repellendus veniam dignissimos quos consectetur!</div>


        </div>
    </div>)
}