import { creditTokensToAll } from "@/app/actions/mongodbFunctions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const vercelCronHeader = req.headers.get("x-vercel-cron-secret");
    const secret = process.env.VERCEL_CRON_SECRET;

    if (vercelCronHeader !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await creditTokensToAll();
        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (err: any) {
        return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
    }
}
