import { Dispatch, SetStateAction } from "react";
import { FileScrollAnimation } from "../fileScrollAnimation/fileScrollAnimation";

export default function MakingReadme({ repoTree }: { repoTree: any[] }) {
    console.log(repoTree)
    const filePathNames = repoTree
        .map(file => file.path)
        .sort((a, b) => a.localeCompare(b));
    return (<>
        <div className="">
            <div className="flex items-center justify-center">
                <FileScrollAnimation filePaths={filePathNames} />
            </div>

            <div></div>
        </div>
    </>)
}