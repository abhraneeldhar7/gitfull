"use server"
import { getServerSession } from "next-auth"
import { options } from "../api/auth/[...nextauth]/options"

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
    return JSON.parse(JSON.stringify(repoList))
}