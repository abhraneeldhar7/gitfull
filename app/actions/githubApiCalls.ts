"use server"
import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"
import { v4 as uuidv4 } from 'uuid';
import { headers } from "next/headers";



export async function getRepos() {
    const session = await getServerSession(options);
    if (!session) return;
    const res = await fetch("https://api.github.com/user/repos?per_page=100", {
        headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: "no-store",
    });

    const repoList = await res.json();
    const sortedRepoList = repoList.sort((a: any, b: any) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })

    return JSON.parse(JSON.stringify(sortedRepoList))
}

export async function getBranches(owner: string, repo: string) {
    const session = await getServerSession(options);
    if (!session) return;
    const branches = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
            },
        }
    ).then((res) => res.json());

    return JSON.parse(JSON.stringify(branches))
}

export async function getRepoTree(owner: string, repo: string, branch: string) {
    const session = await getServerSession(options);
    if (!session) return;
    console.log("fetching: ", `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)
    const tree = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
            },
        }
    ).then((res) => res.json());

    return JSON.parse(JSON.stringify(tree))
}


export async function uploadLandingPageScreenshot({
    owner,
    repo,
    branch,
}: {
    owner: string;
    repo: string;
    branch: string;
}) {

    const session = await getServerSession(options);
    if (!session) return;


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

    const data = await urlRes.json();
    if (!data.homepage) return;

    const imageUrl = `https://api.microlink.io/?url=${encodeURIComponent(data.homepage)}&screenshot=true`;

    console.log(imageUrl);

    // Step 1: Get the screenshot URL from Microlink
    const imgRes = await fetch(imageUrl);
    const imgData = await imgRes.json();
    const screenshotUrl = imgData?.data?.screenshot?.url;

    if (!screenshotUrl) {
        throw new Error("Failed to get screenshot URL");
    }

    // Step 2: Fetch the actual image binary
    const screenshotRes = await fetch(screenshotUrl);
    const arrayBuffer = await screenshotRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const imageFileName = `landingpage-${uuidv4().slice(0, 4)}.png`;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/public/assets/${imageFileName}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            Accept: "application/vnd.github+json"
        },
        body: JSON.stringify({
            message: "add landing page screenshot",
            branch,
            content: base64
        })
    });

    if (!res.ok) {
        const err = await res.json();
        console.error("Upload failed:", err);
    }

    return imageFileName;
}


export async function getReadme(owner: string, repo: string) {
    const session = await getServerSession(options);
    if (!session) return;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`,
        {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
            },
        }
    );

    if (!res.ok) {
        console.error("Failed to fetch README:", res.statusText);
        return null;
    }

    const data = await res.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
}



export async function pushThumbnailtoRepo({ owner, repo, branch, screenshotUrl, imageFileName }: { owner: string, repo: string, branch: string, screenshotUrl: string, imageFileName: string }) {
    const session = await getServerSession(options);
    if (!session) return;


    const screenshotRes = await fetch(screenshotUrl);
    const arrayBuffer = await screenshotRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/public/assets/${imageFileName}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            Accept: "application/vnd.github+json"
        },
        body: JSON.stringify({
            message: "add landing page screenshot - gitfull",
            branch,
            content: base64
        })
    });
}


export async function pushReadmetoRepo({ owner, repo, branch, readmeText }: { owner: string, repo: string, branch: string, readmeText: string }) {
    const session = await getServerSession(options);
    if (!session) return;

    const headers = {
        Authorization: `Bearer ${session.user.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
    };
    // Step 1: Get current README (for its SHA)
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=${branch}`, {
        headers,
    });
    const data = await res.json();
    // Step 2: Update the README
    const update = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README.md`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
            message: "update README.md - gitfull",
            content: Buffer.from(readmeText).toString("base64"),
            sha: data.sha,
            branch,
        }),
    });
    if (!update.ok) {
        const error = await update.json();
        console.error("Failed to update README:", error);
    } else {
        console.log("✅ README.md updated successfully!");
    }
}


export async function getGithubProfile(username: string) {
    const session = await getServerSession(options);
    if (!session) return;

    const res = await fetch(`https://api.github.com/users/${username}`,
        {headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/vnd.github+json"
            }}
    )
    const user = await res.json();
    const profileInfo = {
        avatar_url: user.avatar_url,
        name: user.name,
        bio: user.bio
    }

    return JSON.parse(JSON.stringify(profileInfo));

}


export async function getRepoDetails(url: string): Promise<any> {
    const session = await getServerSession(options);
    if (!session) return;
    const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/)?$/);
    if (!match) {
        return null;
    }

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    // Fetch repo info from GitHub API
    const res = await fetch(apiUrl,
        {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/vnd.github+json"
            }
        });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return JSON.parse(JSON.stringify(data))
}


export async function getLanguagePercentage(url: string) {
    const session = await getServerSession(options);
    if (!session) return;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json"
        }
    })
    const data = await res.json();
    return JSON.parse(JSON.stringify(data));
}