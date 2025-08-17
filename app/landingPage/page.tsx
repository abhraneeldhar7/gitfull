import React from 'react'
import styles from "./root.module.css"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkle, Sparkles } from 'lucide-react'


export default function Landingpage() {
  return (
    <div className={styles.main}>

      <div className={styles.heroDiv}>
        <div className='flex flex-col'>

          <div className="w-[fit-content] px-[20px] py-[6px] rounded-[30px] flex items-center gap-[10px] mx-auto mb-[30px] text-[14px] border-[1px] border-[#f9411c]/60"><Sparkles size={15} /> Version 2.0 is in the oven</div>

          <h1 className={styles.textGradient}>One CLick Everything</h1>

          <p className="text-[15px] opacity-[0.7] text-center mt-[20px] md:mt-[10px]">No description, no context needed. Your codebase is the context</p>

          <Button className={styles.heroBtn}>
            <Link href="/login">
              Start hacking
            </Link>
          </Button>

        </div>

        <Image src="/landingPage/heroGif.gif" height={200} width={300} alt='' className={styles.heroGifImg} />


      </div>



      <div className='border-[1px] border-y-[var(--foreground)]/30 mt-[40px] flex flex-col-reverse md:flex-row'>

        <div className='hidden md:flex w-[50px] border-r-[1px] border-r-[var(--foreground)]/30'>
          <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] w-[100%] object-cover invert dark:invert-0' alt='' unoptimized />
        </div>

        <div className='flex-1 flex flex-col h-[100%]'>

          <div className="text-[16px] p-[10px] border-b-[1px] border-b-[var(--foreground)]/30"> How_to_use.jsx</div>
          <div className='p-[10px] px-[14px] relative'>
            <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] md:hidden w-[100%] object-cover invert dark:invert-0 absolute top-0 bottom-0 left-0 right-0 opacity-[0.5] z-[-1]' alt='' unoptimized />


            aa
          </div>
        </div>

        <div className='border-l-[1px] border-l-[var(--foreground)]/30'>
          <Image src="/landingPage/howtouse.gif" height={300} width={400} className='h-[100%] md:h-[400px] w-[100%] object-contain' alt=""/>
        </div>

        <div className='hidden md:flex w-[50px] border-l-[1px] border-l-[var(--foreground)]/30'>
          <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] w-[100%] object-cover invert dark:invert-0' alt='' unoptimized />
        </div>

      </div>

      <div className='h-[500px]'></div>
    </div>
  )
}
