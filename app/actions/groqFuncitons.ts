"use server"

export async function getImportantFiles({
    prompt,
    model = "meta-llama/llama-4-scout-17b-16e-instruct",
}: {
    prompt: string;
    model?: string;
}): Promise<string> {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API!}`,
        },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: "system",
                    content:
                        `You are an expert GitHub README.md writer. Your job is to generate clean, professional, developer-friendly README files from code and folder structure. Now look at this github tree file and in an efficient manner give me the files which are important for writing a readme. we dont want to waste tokens looking through every file, tell me which are important and give output in the format of a array of objects, [
          {
    "path": "",
    "sha": "",
    "size": 1600,
    "url": ""
}, {
    "path": "",
    "sha": "",
    "size": 1600,
    "url": ""
}
            ]`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.4, // Balanced creativity
        }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Groq API Error: ${errorData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
}