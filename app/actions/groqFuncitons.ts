"use server"
import { LlamaTokenizer } from "llama-tokenizer-js";

import { createContextualChunks, estimateTokens, extractThumbnailImage, filterOnlyFilesTree, insertOrReplaceTopImage, removeCSSFilesTree, removeMediaFilesTree } from "@/lib/utils";
import { getGithubProfile, getReadme, getRepoTree, uploadLandingPageScreenshot } from "./githubApiCalls";
import { fileContentObject, pathChunkObject } from "@/lib/types";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { debitTokens, getGuestAccounts, getUserDetails } from "./mongodbFunctions";




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
            console.log("grok response: ", json)
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
    const prompt = `You are an expert senior developer. Given the following file summaries of a codebase, write a professional, clear, detailed, out-standing, beautiful 'README.md' for the GitHub repository. Output only readme text no extra text. Dont start with saying readme or end with ticks, just the raw content of the readme document that i can copy paste as a whole in the repo.

    **DONOT start or end response with anything other than the raw readme, i need to use you in an api**


    Name of owner:${ownerName}
    Name of repo:${repoName} 

Below given is Basic-template of the readme, add more sections which feels appropriate for the given codebase. Use detailed, out-standing, beautiful readme components and emojis.
Use relevant emoji in titles like the ones mentioned.
Add section GitHub Actions if necessary.
For visualizing, use the appropriate type of mermaid code in the required section, keep in mind not to cause parsing error by special charecters. Use appropriate emojis with section headings.


**When describing a section, use appropriate filenames and paths to give reader context where necessary**

Don't add sections as  Acknowledgements,License, Contributing. Your job is to technically document this whole project and it's purpose to the fullest extend while mantaining visually beautiful readme content.

<Basic-template>
# Title
Give good looking title to this repo based on the contents, description and repo name.
Nothing else for this section, only the title.

## 🗂️  Description

Briefly describe what this project does and who it's for. Write in 1-2 paragraphs with a clear tone.

## ✨ Key Features

List the core features implemented in the project. Group them if possible based on functionality or domain area. Use readme components hierarchy to make it look beautiful.

## 🗂️ Folder Structure

Use a Mermaid diagram to represent the main structure. Keep it high-level and organized.
**Keep in mind not to cause parsing error by special charecters**

Example:
\`\`\`mermaid
graph TD;
  src-->components;
  src-->pages;
  pages-->index.tsx;
\`\`\`

## 🛠️ Tech Stack

List all major technologies, frameworks, libraries used in this project in this format.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?logo=mongodb&logoColor=white&style=for-the-badge)


## ⚙️ Setup Instructions

Give basic instructions to run the project locally. Use code blocks and bullet points.

Git clone url should be like this:
https://github.com/${ownerName}/${repoName}.git

</Basic-template>


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
    You are an expert technical writer. Given the two readme files of a codebase, you job is to compare readmeA and readmeB, if there exists something that exists in readmeA but doesn't in readmeB, smoothly put those sections in readmeB, in the correct place logically. Remember to not break any existing structure or section in readmeB.
    If a section is present in readmeA but not in readmeB, simply add that section, donot combine 2 sections together.
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


export async function getUserDescription(bio: string) {
    const prompt = `This is a bio of a github user, write a short description to describe them. No extra text other than tht in front or end. Use simple plain text.
    
    <Bio>
    ${bio}
    </Bio>
    `

    const description = await askGroq(prompt);
    return description;
}




export async function makeReadme(owner: string, repo: string, branch: string, email: string) {
    const session = await getServerSession(options);
    if (!session) return;

    const repoTree = await getRepoTree(owner, repo, branch);
    const filteredTree = removeMediaFilesTree(filterOnlyFilesTree(removeCSSFilesTree(repoTree.tree)));


    const tokensNeeded = estimateTokens(filteredTree)
    console.log("estimarted token: ", tokensNeeded)
    const userDetails = await getUserDetails(email);
    if (tokensNeeded > userDetails.tokens || tokensNeeded > 100000) {
        return;
    }

    const guestAccounts = await getGuestAccounts();

    if (!guestAccounts.emails.includes(email)) {
        await debitTokens(email, tokensNeeded)
    }


    // Getting initial summary very high level of repo, future cotnext
    // return;
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


    const ownerDetails = await getGithubProfile(owner);
    const description = await getUserDescription(ownerDetails.bio)

    readmeText = readmeText + `\n\n\n
<br><br>
<div align="center">
<img src="${ownerDetails.avatar_url}" width="120" />
<h3>${ownerDetails.name}</h3>
<p>${description}</p>
</div>
<br>
<p align="right">
<img src="https://gitfull.vercel.app/appLogo.png" width="20"/>  <a href="https://gitfull.vercel.app">Made by GitFull</a>
</p>
    `



    let thumbnailUrl = null;
    if (existingReadme) thumbnailUrl = extractThumbnailImage(existingReadme as string);
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