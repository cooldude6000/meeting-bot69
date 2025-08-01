import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { WebClient } from "@slack/web-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findFirst({
            where: {
                clerkId: userId
            }
        })

        if (!user?.slackTeamId) {
            return NextResponse.json({ error: 'slack not connected' }, { status: 400 })
        }

        const installation = await prisma.slackInstallation.findUnique({
            where: {
                teamId: user.slackTeamId
            }
        })

        if (!installation) {
            return NextResponse.json({ error: 'installation not found' }, { status: 400 })
        }

        const slack = new WebClient(installation.botToken)

        const channels = await slack.conversations.list({
            types: 'public_channel',
            limit: 50
        })

        return NextResponse.json({
            channels: channels.channels?.map(ch => ({
                id: ch.id,
                name: ch.name
            })) || []
        })
    } catch (error) {
        console.error('slack setup error:', error)
        return NextResponse.json({ error: 'failed to fetch channels' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const { channelId, channelName } = await request.json()

        await prisma.user.updateMany({
            where: {
                clerkId: userId
            },
            data: {
                preferredChannelId: channelId,
                preferredChannelName: channelName
            }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Slack setup save error:', error)
        return NextResponse.json({ error: 'failed to save setup' }, { status: 500 })
    }
}