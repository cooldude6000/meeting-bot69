import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.user.updateMany({
            where: {
                clerkId: userId
            },
            data: {
                slackConnected: false,
                slackUserId: null,
                slackTeamId: null,
                preferredChannelId: null,
                preferredChannelName: null
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('slack disconnect error:', error)
        return NextResponse.json({ error: 'failed to disconnect' }, { status: 500 })
    }
}