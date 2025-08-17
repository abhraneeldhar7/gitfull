"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "./root.module.css"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GitBranch, MousePointer2, PartyPopper, Sparkle, Sparkles } from 'lucide-react'
import ReactPlayer from 'react-player'

export default function Landingpage() {
  const vidRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true)
    vidRef?.current?.click();
  }, [])
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

        {mounted &&
          <div ref={vidRef} className={styles.heroGifDiv}>
            <ReactPlayer height="100%" width="100%" src="/landingPage/heroVid.mp4" playing={true} muted loop />
          </div>
        }


        <div className="bg-gradient-to-t from-[var(--background)] to-[transparent] absolute z-[2] bottom-0 left-0 w-[100%] h-[200px]"></div>
      </div>





      <div className='border-[1px] md:border-x-[0px] border-[var(--foreground)]/30 mt-[40px] flex flex-col-reverse md:flex-row'>

        <div className='hidden md:flex w-[50px] border-r-[1px] border-r-[var(--foreground)]/30'>
          <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] w-[100%] object-cover invert dark:invert-0' alt='' unoptimized />
        </div>

        <div className='flex-1 flex flex-col h-[100%]'>

          <div className="text-[16px] p-[10px] px-[20px] border-b-[1px] border-[var(--foreground)]/30 border-t-[2px] md:border-t-[0px]"> How_to_use.mp4</div>
          <div className='p-[10px] px-[14px] relative'>

            <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] md:hidden w-[100%] object-cover invert dark:invert-0 absolute top-0 bottom-0 left-0 right-0 opacity-[0.5] z-[-1]' alt='' unoptimized />

            <div className='text-[20px] flex flex-col gap-[10px]'>
              <p className='flex gap-[10px] items-center'><MousePointer2 size={18} color='#f9411c' /> Select your repository</p>
              <p className='flex gap-[10px] items-center'><GitBranch size={18} color='#f9411c' /> Configure branch</p>
              <p className='flex gap-[10px] items-center'><PartyPopper size={18} color='#f9411c' /> Click <span className='text-[#f9411c]'>proceed</span></p>
            </div>
          </div>
        </div>

        <div className='border-l-[1px] border-l-[var(--foreground)]/30'>
          {mounted &&
            <div className='h-[100%] md:h-[400px] w-[100%] object-contain'>
              <ReactPlayer height="100%" width="100%" src="/landingPage/howtousevid.mp4" playing={true} muted loop />
            </div>
          }
        </div>

        <div className='hidden md:flex w-[50px] border-l-[1px] border-l-[var(--foreground)]/30'>
          <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] w-[100%] object-cover invert dark:invert-0' alt='' unoptimized />
        </div>

      </div>

      <div className='h-[500px]'></div>
    </div>
  )
}
