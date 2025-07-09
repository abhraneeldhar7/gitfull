import Image from "next/image"
import styles from "./twitter.module.css"
import { AlignVerticalJustifyStartIcon, Bookmark, Dot, EllipsisIcon, Heart, LucideReceiptPoundSterling, MessageCircle } from "lucide-react"
export default function TwitterCard() {
    return (<div className={styles.cardMain}>
        <EllipsisIcon size={20} className="absolute right-[10px] top-[7px] opacity-[0.5]" />
        <div className="w-[40px]">
            <Image src="https://res.cloudinary.com/dytynwrxu/image/upload/profilePics/101428758399536600490.jpg?v=2025-07-09" width={40} height={40} alt="" className="min-w-[40px] h-[40px] rounded-[50%]" unoptimized />
        </div>

        <div className="flex flex-col gap-[5px]">
            <div className="flex items-center gap-[5px] h-[20px]">
                <h1 className="text-[18px]">Abhraneel</h1>
                <p className="flex items-center text-[15px] opacity-[0.6]">@abhraneeldhar <Dot /> 2h</p>
            </div>

            <div className="text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates magni nostrum ullam dolorum corrupti error? Repellendus veniam dignissimos quos consectetur!</div>

            <div className="flex items-center justify-between mt-[10px]">

                <div className="flex items-center gap-[4px] opacity-[0.5]">
                    <MessageCircle size={17} />
                    <p className="text-[12px]">32</p>
                </div>

                <div className="flex items-center gap-[4px] opacity-[0.5]">
                    <LucideReceiptPoundSterling size={17} />
                    <p className="text-[12px]">32</p>
                </div>
                <div className="flex items-center gap-[4px] opacity-[0.5]">
                    <Heart size={17} />
                    <p className="text-[12px]">32</p>
                </div>
                <div className="flex items-center gap-[4px] opacity-[0.5]">
                    <AlignVerticalJustifyStartIcon size={17} />
                    <p className="text-[12px]">32</p>
                </div>
                <div className="flex items-center gap-[4px] opacity-[0.5]">
                    <Bookmark size={17} />
                </div>


            </div>
        </div>
    </div>)
}