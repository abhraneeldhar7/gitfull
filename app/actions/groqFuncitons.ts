"use server"
import { LlamaTokenizer } from "llama-tokenizer-js";

import { extractThumbnailImage, filterOnlyFilesTree, insertOrReplaceTopImage, removeCSSFilesTree, removeMediaFilesTree } from "@/lib/utils";
import { getReadme, getRepoTree, uploadLandingPageScreenshot } from "./githubApiCalls";
import { fileContentObject, pathChunkObject } from "@/lib/types";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';




const API_KEY = process.env.GROQ_API!;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const openRouterApi = process.env.OPENROUTER_API_KEY

async function askGroq(prompt: string): Promise<any | null> {
    await new Promise((r) => setTimeout(r, 2000));
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
    };

    const body = {
        model: MODEL,
        messages: [
            {
                role: "system",
                content:
                    "You are a professional technical writer specializing in software documentation. Your job is to write clean, precise, and informative README content that helps developers understand, install, use, and contribute to software projects. Prioritize clarity, technical accuracy, and structure. Assume your audience is a developer who wants to grasp the purpose and structure of a GitHub repository.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.4,
    };

    let attempts = 0;
    const maxAttempts = 5;


    while (attempts < maxAttempts) {
        try {
            console.log(`🔁 [Groq] Sending request (attempt ${attempts + 1}/${maxAttempts})...`);

            const res = await fetch(API_URL, {
                method: "POST",
                headers,
                body: JSON.stringify(body),
            });

            // Handle rate limiting
            if (res.status === 429) {
                const retryAfter = res.headers.get("retry-after") || "60";
                console.log(res)
                const waitTime = (parseFloat(retryAfter) * 1000);
                console.warn(`⏳ Rate limited. Retrying in ${retryAfter} seconds...`);
                await new Promise((r) => setTimeout(r, waitTime));
                attempts++;
                continue;
            }

            const json = await res.json();
            console.log(json)
            const content = json.choices?.[0]?.message?.content;
            console.log(content)
            if (!content) {
                console.warn("⚠️ No content in Groq response.");
                return null;
            }

            console.log("✅ [Groq] Response received.");
            // return parseGroqResponse(content);
            return content
        } catch (error) {
            console.error("❌ [Groq] Unexpected error:", error);
            attempts++;
            await new Promise((r) => setTimeout(r, 1000));
        }
    }

    console.error(`❌ [Groq] Exceeded ${maxAttempts} retry attempts. Aborting.`);
    return null;
}


async function getInitialSummary(repoFilesTree: any[]) {
    const initialSummaryPrompt = `
    You are a senior engineer generating a professional explaining a brief summary on a repo.
Below is the recursive folder tree of the repository. Based only on the file and folder structure, provide a high-level summary of the project to help someone understand what the codebase is about before diving into individual files.

Your output will be used as context when analyzing specific code files.

Focus on:
- The probable purpose of the project
- Major technologies or frameworks likely used

Dont try to format it using *
Keep it simple, I need to pass this brief summary with every file chunk for better context. Avoid multiple newlines, just plain simple texts, no blank newlines between sentences, .


File Path:
${JSON.stringify(repoFilesTree, null, 2)}
  `

    const initialSummary = await askGroq(initialSummaryPrompt);
    return initialSummary;
}

function createContextualChunks(files: any[], maxTokens = 10000) {
    // 1. Precompute token estimates with directory hierarchy
    const processedFiles = files.map(file => {
        const pathParts = file.path.split('/');
        const hierarchyWeight = 1 + (pathParts.length * 0.1); // Favor nested files
        const tokenEstimate = Math.ceil((file.path.length + file.size) * 0.4 * hierarchyWeight);

        return {
            ...file,
            tokenEstimate,
            directory: pathParts.slice(0, -1).join('/') || 'root',
            filename: pathParts[pathParts.length - 1]
        };
    });

    // 2. Filter and warn about oversized files
    const [oversized, validFiles] = processedFiles.reduce((acc, file) => {
        file.tokenEstimate > maxTokens ?
            acc[0].push(file) : acc[1].push(file);
        return acc;
    }, [[], []]);

    // Optional: log oversized files
    if (oversized.length > 0) {
        console.warn(`⚠️ ${oversized.length} files exceeded token limit and will be skipped:`);
        oversized.forEach((file: any) => console.warn(`- ${file.path} (${file.tokenEstimate} tokens)`));
    }

    // 3. Sort valid files by token size ASC (small files first)
    validFiles.sort((a: any, b: any) => a.tokenEstimate - b.tokenEstimate);

    // 4. Greedily pack chunks without exceeding maxTokens
    const chunks: any[] = [];
    let currentChunk: any[] = [];
    let currentTokens = 0;

    for (const file of validFiles) {
        if (currentTokens + file.tokenEstimate > maxTokens) {
            // Push current chunk
            chunks.push(currentChunk);
            // Start new chunk
            currentChunk = [file];
            currentTokens = file.tokenEstimate;
        } else {
            currentChunk.push(file);
            currentTokens += file.tokenEstimate;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}

async function fetchFileFromGithub(
    fileUrl: string,
    accessToken: string
): Promise<string> {
    const res = await fetch(fileUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3.raw',
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`);
    }

    return await res.text();
}

async function fetchFileContentFromChunk(
    nestedArrays: pathChunkObject[][]
): Promise<fileContentObject[][]> {


    const session = await getServerSession(options);
    if (!session) {
        console.error("no session")
    }

    const result: fileContentObject[][] = [];


    for (const fileArray of nestedArrays) {
        const enrichedArray: fileContentObject[] = [];

        for (const file of fileArray) {
            try {
                const content = await fetchFileFromGithub(file.url, session?.user.accessToken as string);
                enrichedArray.push({
                    path: file.path,
                    sha: file.sha,
                    size: file.size,
                    url: file.url,
                    tokenEstimate: file.tokenEstimate,
                    fileContent: content,
                });
            } catch (err) {
                console.error(`Error fetching content for ${file.path}:`, err);
                enrichedArray.push({
                    ...file,
                    fileContent: '[Error fetching content]',
                });
            }
        }
        result.push(enrichedArray);
    }
    return result;
}

async function summarizeChunks(
    initialSummary: string,
    chunks: fileContentObject[][]
): Promise<string> {
    let results = "";
    let chunkNumber = 0;
    for (const chunk of chunks) {

        const prompt = chunk
            .map(
                (file) => `<file>\npath: ${file.path}\nfileContent:\n${file.fileContent}\n</file>`
            )
            .join('\n');

        const fullPrompt = `You are making summary for the code files in a big codebase.Your job is to summarize each file,how it contributes to the big codebase. For each file:

        Give output in the format, nothing else no extra text, i am using you in an api, the xaml structure is very important for future references, donot hallucinate that:
        <File>
        path:"path of the file"\n
        summary:"summary of the file"
        </File>\n
        <File>
        path:"path of the file"\n
        summary:"summary of the file"
        </File>
        No json, for the whole prompt, return the output in the given manner plain text.

1. Explain clearly, in detail what the file does.
2. If it exports functions, components, or classes, briefly describe each.
3. Mention what kind of module or layer this belongs to (e.g. UI, logic, routing, config, API, etc.).
4. Describe how it connects or interacts with other parts of the project (e.g. imported/exported elsewhere, used by specific routes or components).
5. If it seems isolated or standalone, mention that too.
6. Summarize any patterns (like reusable hooks, layout components, shared utils, etc.).
7. If this file looks auto-generated, write that explicitly.\n\n


---
Below is the high level summary of the project and list of file paths with their full content.
<Summary>\n
${initialSummary}
</summary>\n\n

---
Here are the file contents
${prompt}`;

        try {
            console.log("summarizing chunk ", chunkNumber)
            const summary = await askGroq(fullPrompt);

            console.log("Summarized chunk ", chunkNumber++)

            results = results + summary + "\n\n";
        } catch (err) {
            console.error('Error while summarizing chunk:', err);

        }
        await new Promise((r) => setTimeout(r, 1000));
    }
    return results;
}

async function combineSummaryToReadme(ownerName: string, repoName: string, chunkSummaries: string) {
    const prompt = `You are an expert technical writer. Given the following file summaries of a codebase, write a professional, clear, and concise 'README.md' for the GitHub repository. Keep the emojis. Dont give extra text or json. Output only readme text no extra text. Dont start with saying readme or end with ticks, just the raw content of the readme document that i can copy paste as a whole in the repo.


    Name of owner:${ownerName}
    Name of repo:${repoName} 

The output should contain these sections below.
Add more sections to document this codebase better if enccesary, use relevant emoji in titles like the ones mentioned. For visualizing, use the appropriate type of mermaid code in the required section.

---
# Title
Give good looking title to this repo based on the contents, description and repo name

## 🗂️  Description

Briefly describe what this project does and who it's for. Write in 2-3 paragraphs with a clear tone.

## ✨ Key Features

List the core features implemented in the project. Group them if possible based on functionality or domain area. Use all sorts of readme component hierarchy to make it look beautiful.

## 🗂️ Folder Structure

Use a Mermaid diagram to represent the main structure. Keep it high-level and organized.

Example:
\`\`\`mermaid
graph TD;
  src-->components;
  src-->pages;
  pages-->index.tsx;
\`\`\`

## 🛠️ Tech Stack

List all major technologies, frameworks, libraries used in this project::
- Item1
- Item2
- Item3

## ⚙️ Setup Instructions

Give basic instructions to run the project locally. Use code blocks and bullet points.

Git clone url should be like this:
https://github.com/${ownerName}/${repoName}.git

---

Here are the file summaries:

<fileSummaries>
${chunkSummaries}
</fileSummaries>
`

    const readmeText = await askGroq(prompt);
    return readmeText;
}

async function mergeReadmes(readmeA: string, readmeB: string) {
    const prompt = `
    You are an expert technical writer. Given the two readme files of a codebase, you job is to compare readmeA and readmeB, if there exists something that exists in readmeA but doesn't in readmeB, smoothly put those sections in readmeB, in the correct place logically, which includes sections and cover image at the begining. readmeB is the final output, in readme format, no extra texts.Only output the readme text that goes into github repo, no extra texts.
\n\n

Here are the readme files:\n

    <readmeA>
    ${readmeA}
    </readmeA>

    <readmeB>
    ${readmeB}
    </readmeB>
    `

    const comparedOutput = await askGroq(prompt);
    return comparedOutput;
}







export async function makeReadme(owner: string, repo: string, branch: string, autoSave: boolean) {
    const session = await getServerSession(options);
    if (!session) return;

    const repoTree = await getRepoTree(owner, repo, branch);
    const filteredTree = removeMediaFilesTree(filterOnlyFilesTree(removeCSSFilesTree(repoTree.tree)));

    // Getting initial summary very high level of repo, future cotnext
    const initialSummary = await getInitialSummary(filteredTree);

    // Seperate into chunks
    const filechunks = createContextualChunks(filteredTree);

    // Chunks loaded with files from github
    const fileContent = await fetchFileContentFromChunk(filechunks)

    // Getting summary chunk by chunk from llm
    const summaryChunkText = await summarizeChunks(initialSummary, fileContent);

    // Combining into one readme
    let readmeText = await combineSummaryToReadme(owner, repo, summaryChunkText)

    // compare new redme with old readme
    const existingReadme = await getReadme(owner, repo);
    // if (existingReadme) {
    //     const comparedReadme = await mergeReadmes(existingReadme, readmeText)
    //     readmeText = comparedReadme;
    // }




    // if thumbnail exists in existingreadme
    // make sure thats under the top heading
    // do nothing, return the thang, thumbnialurl=url
    // if no thumbnail in raedme
    // check for deployment url
    // fetch screenshoturl and return the thang, thumbnailurl=screenshoturl



    let thumbnailUrl = extractThumbnailImage(existingReadme as string);
    if (thumbnailUrl) {
        readmeText = insertOrReplaceTopImage(readmeText, thumbnailUrl);
        thumbnailUrl = null;
    }
    else {
        const urlRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                Accept: "application/vnd.github+json"
            }
        });
        if (!urlRes.ok) {
            console.error("Failed to fetch GitHub Pages data:", urlRes.status);
            return null;
        }
        const ssData = await urlRes.json();
        const deploymentLink = ssData.homepage;
        const imageUrl = `https://api.microlink.io/?url=${encodeURIComponent(deploymentLink)}&screenshot=true`;
        const imgRes = await fetch(imageUrl);
        const imgData = await imgRes.json();
        const screenshotUrl = imgData?.data?.screenshot?.url;
        thumbnailUrl = screenshotUrl;
    }


    return {
        thumbnailUrl: thumbnailUrl,
        readmeText: readmeText
    };
}