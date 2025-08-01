import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.redirect(new URL('/integrations?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL))
    }

    return NextResponse.redirect(new URL('/integrations/trello/callback', process.env.NEXT_PUBLIC_APP_URL))
}