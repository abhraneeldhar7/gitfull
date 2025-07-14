"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FileScrollAnimation } from "../fileScrollAnimation/fileScrollAnimation";
import { getRepoTree } from "@/app/actions/githubApiCalls";
import { useStore } from "@/lib/store";

export default function MakingReadme() {
    const currentRepoDetails = useStore((state) => state.currentRepoDetails);
    const dummyFilePaths = [
        "README.md",
        "package.json",
        "public/assets/logo.png",
        "public/index.html",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/components/Navbar.tsx",
        "src/components/Footer.tsx",
        "src/components/Button.tsx",
        "src/hooks/useAuth.ts",
        "src/lib/utils.ts",
        "src/styles/global.css",
        "src/pages/dashboard/index.tsx",
        "src/pages/settings/profile.tsx",
        "src/api/auth/login.ts",
        "src/api/users/getUsers.ts",
        "tests/components/Navbar.test.tsx",
        "tests/utils/utils.test.ts",
        ".github/workflows/deploy.yml",
        ".env.example",
        "next.config.js",
        "tsconfig.json"
    ];

    const [filePathNames, setFilePathNames] = useState(dummyFilePaths)

    useEffect(() => {
        if (!currentRepoDetails) return;
        const gettingTree = async () => {
            const repoTree = await getRepoTree(currentRepoDetails.owner, currentRepoDetails.repo, currentRepoDetails.branch)
            setFilePathNames(repoTree
                .map((file: any) => file.path)
                .sort((a: any, b: any) => a.localeCompare(b)))
        }
        gettingTree();
    }, [currentRepoDetails])

    return (<>
        <div className="flex flex-col px-[10px] max-w-[800px] w-[100%] mx-auto">
            <h1 className="text-center text-[30px] font-[Poppins]">Making your readme</h1>
            <div className="flex items-center justify-center">
                <FileScrollAnimation filePaths={filePathNames} />
            </div>

            <div></div>
        </div>
    </>)
}