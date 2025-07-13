"use server"
import { LlamaTokenizer } from "llama-tokenizer-js";

import { filterOnlyFilesTree, removeCSSFilesTree, removeMediaFilesTree } from "@/lib/utils";
import { getRepoTree, uploadLandingPageScreenshot } from "./githubApiCalls";
import { fileContentObject, pathChunkObject } from "@/lib/types";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

const API_KEY = process.env.GROQ_API!;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";



export async function askGroq(prompt: string): Promise<any | null> {
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
        max_tokens: 8192,
        // response_format: { type: "json_object" }, // Crucial: Force JSON output
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
                const retryAfter = res.headers.get("retry-after") || "10";
                const waitTime = parseInt(retryAfter) * 1000;
                console.warn(`⏳ Rate limited. Retrying in ${retryAfter} seconds...`);
                await new Promise((r) => setTimeout(r, waitTime));
                attempts++;
                continue;
            }

            // Handle other errors
            // if (!res.ok) {
            //     const errText = await res.text();
            //     console.error(`❌ [Groq] Request failed: ${res.status} - ${errText}`);
            //     return null;
            // }

            // Process successful response
            const json = await res.json();
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
            await new Promise((r) => setTimeout(r, 2000 * attempts)); // Exponential backoff
        }
    }

    console.error(`❌ [Groq] Exceeded ${maxAttempts} retry attempts. Aborting.`);
    return null;
}

// Dedicated response parser
function parseGroqResponse(content: string): any {
    try {
        // Remove JSON code fences if present
        const cleaned = content
            .trim()
            .replace(/^```(json)?\s*/i, "")
            .replace(/```$/i, "")
            .trim();

        // Handle JSON responses
        if (isLikelyJson(cleaned)) {
            return JSON.parse(cleaned);
        }

        // Handle text responses
        return cleaned;
    } catch (error) {
        console.error("❌ Failed to parse Groq response:", error);
        return null;
    }
}

// Improved JSON detection
function isLikelyJson(str: string): boolean {
    const trimmed = str.trim();
    return (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
    );
}


function createContextualChunks(files: any[], maxTokens = 20000) {
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

    // if (oversized.length) {
    //     console.warn(`Oversized files skipped (${oversized.length}):`);
    //     oversized.forEach((f: any) => console.warn(`- ${f.path} (${f.tokenEstimate} tokens)`));
    // }

    // 3. Group by directory with context scoring
    const directoryGroups = validFiles.reduce((groups: any, file: any) => {
        const dir = file.directory;
        if (!groups[dir]) {
            groups[dir] = {
                files: [],
                totalTokens: 0,
                priority: dir.includes('src') ? 1 :
                    dir.includes('app') ? 0.9 :
                        dir.includes('docs') ? 0.8 : 0.5
            };
        }
        groups[dir].files.push(file);
        groups[dir].totalTokens += file.tokenEstimate;
        return groups;
    }, {});

    // 4. Create chunks preserving context
    const chunks = [];
    const sortedGroups: any = Object.entries(directoryGroups)
        .sort((a: any[], b: any[]) => b[1].priority - a[1].priority);

    for (const [dir, group] of sortedGroups) {
        group.files.sort((a: any, b: any) =>
            b.filename.includes('.test.') - a.filename.includes('.test.') || // Test files last
            a.tokenEstimate - b.tokenEstimate // Smaller files first
        );

        let currentChunk = [];
        let currentTokens = 0;

        for (const file of group.files) {
            // Start new chunk if adding would exceed limit
            if (currentTokens + file.tokenEstimate > maxTokens) {
                chunks.push(currentChunk);
                currentChunk = [];
                currentTokens = 0;
            }

            currentChunk.push(file);
            currentTokens += file.tokenEstimate;
        }

        if (currentChunk.length) chunks.push(currentChunk);
    }

    // 5. Merge small chunks from related directories
    const mergedChunks = [];
    let mergeBuffer: any[] = [];
    let mergeTokens = 0;

    for (const chunk of chunks) {
        const chunkTokens = chunk.reduce((sum, f) => sum + f.tokenEstimate, 0);
        const sameRootDir = chunk[0]?.directory.split('/')[0] === mergeBuffer[0]?.directory.split('/')[0];

        if (mergeTokens + chunkTokens <= maxTokens && sameRootDir) {
            mergeBuffer.push(...chunk);
            mergeTokens += chunkTokens;
        } else {
            if (mergeBuffer.length) mergedChunks.push(mergeBuffer);
            mergeBuffer = [...chunk];
            mergeTokens = chunkTokens;
        }
    }
    if (mergeBuffer.length) mergedChunks.push(mergeBuffer);

    return mergedChunks;
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

export async function fetchFileContentFromChunk(
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



export async function summarizeChunks(
    initialSummary: string,
    chunks: fileContentObject[][]
): Promise<string> {
    let results = "";

    for (const chunk of chunks) {
        const prompt = chunk
            .map(
                (file) => `<file>\npath: ${file.path}\nfileContent:\n${file.fileContent}\n</file>`
            )
            .join('\n');

        const fullPrompt = `You are making summary for the code files in a big codebase. Below is the high level summary of the project and list of file paths with their full content. How each file contributes to the big codebase. For each file:

        Give output in the format, nothing else no extra text, i am using you in an api:
        <File>
        path:"path of the file"\n
        summary:"summary of the file"
        </File>\n
        <File>
        path:"path of the file"\n
        summary:"summary of the file"
        </File>
        No json, for the whole prompt, return the output in the given manner plain text.

1. Explain clearly what the file does.
2. If it exports functions, components, or classes, briefly describe each.
3. Mention what kind of module or layer this belongs to (e.g. UI, logic, routing, config, API, etc.).
4. Describe how it connects or interacts with other parts of the project (e.g. imported/exported elsewhere, used by specific routes or components).
5. If it seems isolated or standalone, mention that too.
6. Summarize any patterns (like reusable hooks, layout components, shared utils, etc.).
7. If this file looks auto-generated, write that explicitly.\n\n
<Summary>\n
${initialSummary}
</summary>\n\n

${prompt}`;

        try {
            const summary = await askGroq(fullPrompt);
            // Transform JSON to <File> format
            const transformed = summary?.files?.map((file: any) => {
                return `<File>\n
                Path: "${file.path}" \n Summary: "${file.summary}" \n </File>`;
            }).join('\n\n');

            results = results + summary + "\n\n";
        } catch (err) {
            console.error('Error while summarizing chunk:', err);

        }
    }
    return results;
}

async function combineSummaryToReadme(ownerName: string, repoName: string, chunkSummaries: string) {
    const prompt = `You are an expert technical writer. Given the following file summaries of a codebase, write a professional, clear, and concise 'README.md' for the GitHub repository. Keep the emojis. Dont give extra text or json.

    Name of owner:${ownerName}
    Name of repo:${repoName} 

The output must follow this exact format and use appropriate markdown syntax and formatting:

---
# Title
Give a title to this repo or use reponame as fallback if unsure.

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




export async function makeReadme(owner: string, repo: string, branch: string) {
    console.log("getting tree")
    const repoTree = await getRepoTree(owner, repo, branch);

    const filteredTree = removeMediaFilesTree(filterOnlyFilesTree(removeCSSFilesTree(repoTree.tree)));

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
${JSON.stringify(filteredTree, null, 2)}
    `

    const initialSummary = await askGroq(initialSummaryPrompt);
    const filechunks = createContextualChunks(filteredTree);
    const fileContent = await fetchFileContentFromChunk(filechunks)
    const summaryChunkText = await summarizeChunks(initialSummary, fileContent);
    let readmeText = await combineSummaryToReadme(owner, repo, summaryChunkText)


    const landingPageUrl = await uploadLandingPageScreenshot({ owner: owner, repo: repo, branch: branch })

    if (landingPageUrl) {
        readmeText = `![Live Screenshot](./public/assets/${landingPageUrl})\n` + readmeText
    }


    return readmeText;
}