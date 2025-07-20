import Image from "next/image"
import styles from "./twitter.module.css"
import { AlignVerticalJustifyStartIcon, Bookmark, Dot, EllipsisIcon, Heart, LucideReceiptPoundSterling, MessageCircle } from "lucide-react"
export default function TwitterCard() {
    return (<div className={`${styles.cardMain} border border-[1px] border-[var(--foreground)]/30`}>
        <EllipsisIcon size={20} className="absolute right-[10px] top-[7px] opacity-[0.5]" />
        <div className="w-[40px]">
            <Image src="/socialCards/MrRobot.png" width={40} height={40} alt="" className="min-w-[40px] object-cover h-[40px] rounded-[50%]" unoptimized />
        </div>

        <div className="flex flex-col gap-[5px]">
            <div className="flex items-center gap-[5px] h-[20px]">
                <h1 className="text-[16px]">Mr Robot</h1>
                <p className="flex items-center text-[12px] opacity-[0.6]">@mrRobot <Dot /> 2h</p>
            </div>

            <div className="text-[15px]">Tired of your Heroku app taking 20 seconds to wake up? I built a free tool that pings it every 15 mins so it never sleeps again.</div>

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