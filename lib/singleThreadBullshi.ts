export async function getReadme(owner: string, repo: string, token: string) {

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
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
