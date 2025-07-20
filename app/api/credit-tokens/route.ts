import { creditTokensToAll } from "@/app/actions/mongodbFunctions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        const result = await creditTokensToAll();
        return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (err: any) {
        return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
    }
}
