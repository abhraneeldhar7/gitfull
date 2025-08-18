"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from "./root.module.css"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, GitBranch, MousePointer2, PartyPopper, Sparkle, Sparkles } from 'lucide-react'
import ReactPlayer from 'react-player'
import { NumberTicker } from '@/components/magicui/number-ticker'

export default function Landingpage() {
  const vidRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true)
    vidRef?.current?.click();
  }, [])



  const exampleRepos = [
    {
      repoName: "Blastro",
      owner: "Xeven777",
      thumbnail: "https://blog.anish7.me/opengraph-image.jpg",
      link: "https://github.com/Xeven777/blastro"
    },
    {
      repoName: "Lazyping",
      owner: "abhraneeldhar7",
      thumbnail: "https://lazyping.vercel.app/opengraph-image.png",
      link: "https://github.com/abhraneeldhar7/lazy-ping"
    },
{
      repoName: "T-Editor",
      owner: "oneWritesCode",
      thumbnail: "/landingPage/examples/Teditor.png",
      link: "https://github.com/oneWritesCode/T-Editor"
    },
    {
      repoName: "Go Interpreter",
      owner: "jerkeyray",
      thumbnail: "/landingPage/examples/goInterpreter.webp",
      link: "https://github.com/jerkeyray/go-interpreter"
    },
    {
      repoName: "Quill.ai",
      owner: "Srilochan7",
      thumbnail: "/landingPage/examples/chatpdf.png",
      link: "https://github.com/Srilochan7/Quill.ai/tree/main"
    },
{
      repoName: "Scribbly_web",
      owner: "Arijit-05",
      thumbnail: "/landingPage/examples/scribbly.png",
      link: "https://github.com/Arijit-05/Scribbly_web"
    }
  ]



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

        {!mounted &&
          <div className='h-[50vh]'></div>}
        {mounted &&
          <div ref={vidRef} className={styles.heroGifDiv}>
            <ReactPlayer height="100%" width="100%" src="/landingPage/heroVid.mp4" playing={true} muted loop controls={false} />
          </div>
        }


        <div className="bg-gradient-to-t from-[var(--background)] to-[transparent] absolute z-[2] bottom-0 left-0 w-[100%] h-[60px] md:h-[200px]"></div>
      </div>


      <div className='w-[100%] h-[150px] flex p-[20px] gap-[30px] justify-around w-[100%] max-w-[600px] px-[20px] mx-auto'>

        <div className='text-[25px] text-center flex flex-col items-center'>
          <div>
            <NumberTicker value={20} />+
          </div>
          <p className='text-[18px] opacity-[0.7]'>
            Users
          </p>
        </div>

        <div className='text-[25px] text-center flex-col items-center'>
          <div>
            <NumberTicker value={100} />+
          </div>
          <p className='text-[18px] opacity-[0.7]'>
            Readmes made
          </p>
        </div>


      </div>




      <div className='border-[1px] md:border-x-[0px] border-[var(--foreground)]/30 flex flex-col-reverse md:flex-row'>

        <div className='hidden md:flex w-[50px] border-r-[1px] border-r-[var(--foreground)]/30'>
          <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] w-[100%] object-cover invert dark:invert-0' alt='' unoptimized />
        </div>

        <div className='flex-1 flex flex-col h-[100%]'>

          <div className="text-[16px] p-[10px] px-[20px] border-b-[1px] border-[var(--foreground)]/30 border-t-[2px] md:border-t-[0px]"> How_to_use.mp4</div>
          <div className='p-[15px] relative'>

            <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] md:hidden w-[100%] object-cover invert dark:invert-0 absolute top-0 bottom-0 left-0 right-0 opacity-[0.5] z-[-1]' alt='' unoptimized />

            <div className='text-[20px] flex flex-col gap-[10px]'>
              <p className='flex gap-[10px] items-center'><MousePointer2 size={18} color='#f9411c' /> Select your repository</p>
              <p className='flex gap-[10px] items-center'><GitBranch size={18} color='#f9411c' /> Configure branch</p>
              <p className='flex gap-[10px] items-center'><Check size={18} color='#f9411c' /> Click <span className='text-[#f9411c]'>proceed</span></p>

              <p className='flex gap-[10px] items-center'><PartyPopper size={18} color='#f9411c' /> Done</p>
            </div>
          </div>
        </div>

        <div className='border-l-[1px] border-l-[var(--foreground)]/30'>
          {mounted &&
            <div className='h-[100%] md:h-[400px] w-[100%] object-contain'>
              <ReactPlayer height="100%" width="100%" src="/landingPage/howtousevid.mp4" playing={true} muted loop controls={false}/>
            </div>
          }
        </div>

        <div className='hidden md:flex w-[50px] border-l-[1px] border-l-[var(--foreground)]/30'>
          <Image src="/landingPage/carbonfibre.jpg" height={100} width={100} className='h-[100%] w-[100%] object-cover invert dark:invert-0' alt='' unoptimized />
        </div>

      </div>

      <div className="p-[10px] py-[40px]  md:px-[50px]">

        <div className='flex items-center gap-[10px]'>
          <div className='rounded-[10px] h-[2px] w-[30px] md:w-[50px] bg-[#f9411c]'></div>
          <h1 className='text-[22px] font-[Satoshi]'>Examples</h1>
          <div className='rounded-[10px] h-[2px] w-[100%] bg-[#f9411c]'></div>
        </div>

        <div className={styles.exampleHolder}>

          {exampleRepos.map((repo, index) => (

            <div className='flex justify-center' key={index}>
              <Link className='w-[fit-content]' href={repo.link} target='_blank' >
                <div className='w-[100%] max-w-[400px] flex flex-col gap-[12px]'>
                  <Image src={repo.thumbnail} height={100} width={200} alt='' className="h-[220px] w-[100%] rounded-[12px] borde-[1px] border-[var(--foreground)]/30 object-cover transition-all duration-200 hover:translate-y-[-10px]" unoptimized />
                  <div className='flex flex-col gap-[0px] pl-[10px]'>
                    <h1 className='text-[22px] leading-[1.2em]'>{repo.repoName}</h1>
                    <p className='text-[17px] opacity-[0.7]'>{repo.owner}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}



        </div>


      </div>


    </div>
  )
}
