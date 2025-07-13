import { useEffect, useState, useRef } from 'react';

export const FileScrollAnimation = ({ filePaths }: { filePaths: string[] }) => {
    // Sample file paths - replace with your actual data


    const [displayedFiles, setDisplayedFiles] = useState<string[]>([]);
    const [scrollIndex, setScrollIndex] = useState(0);
    const scrollInterval = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize with first 7 files
    useEffect(() => {
        setDisplayedFiles(filePaths.slice(0, 7));
    }, []);

    // Set up auto-scrolling
    useEffect(() => {
        scrollInterval.current = setInterval(() => {
            setScrollIndex(prev => (prev + 1) % filePaths.length);
        }, 1000);

        return () => {
            if (scrollInterval.current) {
                clearInterval(scrollInterval.current);
            }
        };
    }, [filePaths.length]);


    useEffect(() => {
        const newFiles = [];
        for (let i = 0; i < 7; i++) {
            const index = (scrollIndex + i) % filePaths.length;
            newFiles.push(filePaths[index]);
        }
        setDisplayedFiles(newFiles);
    }, [scrollIndex, filePaths]);

    return (
        <div className="w-[350px] mx-auto">
            <div
                ref={containerRef}
                className="relative overflow-hidden"
            >
                {/* Top fade gradient */}
                <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-[var(--background)] to-transparent z-10 pointer-events-none"></div>

                {/* File list container */}
                <div className="py-[10px] max-h-[220px] overflow-hidden">
                    {displayedFiles.map((file, index) => (
                        <div
                            key={`${file}-${index}`}
                            className="px-4 py-2.5 group transition-all duration-300"
                        >
                            <div className="flex items-center">
                                <svg
                                    className="w-4 h-4 mr-3 flex-shrink-0 text-[var(--foreground)] "
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <span className="text-[var(--foreground)] font-mono text-sm truncate group-hover:text-white transition-colors cursor-pointer select-none">
                                    {file}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom fade gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[var(--background)] from-0% to-transparent to-100% z-10 pointer-events-none"></div>


                {/* Subtle border accents */}
                {/* <div className="absolute inset-0 rounded-lg border border-gray-800 pointer-events-none"></div> */}
            </div>


        </div >
    );
};
