import { creditTokensToAll } from "@/app/actions/mongodbFunctions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const vercelCronHeader = req.headers["x-vercel-cron-secret"];
    const secret = process.env.VERCEL_CRON_SECRET;

    if (!vercelCronHeader || vercelCronHeader !== secret) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const result = await creditTokensToAll();
        return res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    } catch (err: any) {
        return res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
}
