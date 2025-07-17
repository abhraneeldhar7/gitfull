import { File, FileTerminal } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '../ui/button';

export const FileScrollAnimation = ({ filePaths }: { filePaths: string[] }) => {

    const containerRef = useRef<HTMLDivElement>(null);


    function scrollDownOverTime(duration = 10000) {
        const container = containerRef.current;
        if (!container) return;

        const targetScroll = container.scrollHeight - container.clientHeight;

        function startAnimationCycle() {
            const startTime = performance.now();

            function animateScroll(currentTime: number) {
                if (!container) return;

                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1); // 0 to 1

                container.scrollTop = targetScroll * progress;

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    // Reset to top and restart scroll
                    container.scrollTop = 0;
                    requestAnimationFrame(() => startAnimationCycle());
                }
            }

            requestAnimationFrame(animateScroll);
        }

        startAnimationCycle();
    }


    useEffect(() => {
        scrollDownOverTime(filePaths.length * 1000);
    }, []);

    return (
        <div className="w-[350px]">
            <div className="relative overflow-hidden">

                {/* Top fade gradient */}
                <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-[var(--background)] to-transparent z-10 pointer-events-none"></div>

                {/* File list container */}
                <div ref={containerRef} className="py-[10px] max-h-[220px] overflow-hidden flex flex-col gap-[6px]">
                    {filePaths.map((file, index) => (
                        <div key={index} className="flex items-center gap-[10px] text-[18px] font-{Inter} w-[100%] break-words">
                            <FileTerminal size={18} /> <p className="whitespace-nowrap overflow-hidden text-ellipsis">{file}</p>

                        </div>
                    ))}
                </div>


                {/* Bottom fade gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[var(--background)] from-0% to-transparent to-100% z-10 pointer-events-none"></div>


            </div>


        </div >
    );
};
