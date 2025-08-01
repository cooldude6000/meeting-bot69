import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { meetingId: string } }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "not authed" }, { status: 401 })
        }

        const { meetingId } = await params
        const { botScheduled } = await request.json()

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        })

        if (!user) {
            return NextResponse.json({ error: "user not found" }, { status: 404 })
        }

        const meeting = await prisma.meeting.update({
            where: {
                id: meetingId,
                userId: user.id
            },
            data: {
                botScheduled: botScheduled
            }
        })

        return NextResponse.json({
            success: true,
            botScheduled: meeting.botScheduled,
            message: `Bot ${botScheduled ? 'enable' : 'disabled'} for meeting`
        })
    } catch (error) {
        console.error('Bot toogle error:', error)
        return NextResponse.json({
            error: "Failed to update bot status"
        }, { status: 500 })
    }
}