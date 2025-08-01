import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { WebClient } from "@slack/web-api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let dbUser = null

    try {
        const user = await currentUser()

        if (!user) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const { meetingId, summary, actionItems } = await request.json()

        dbUser = await prisma.user.findFirst({
            where: {
                clerkId: user.id
            }
        })

        if (!dbUser || !dbUser.slackTeamId) {
            return NextResponse.json({ error: 'slack not connected' }, { status: 400 })
        }

        const installation = await prisma.slackInstallation.findUnique({
            where: {
                teamId: dbUser.slackTeamId
            }
        })

        if (!installation) {
            return NextResponse.json({ error: 'slack workspace not found' }, { status: 400 })
        }
        const slack = new WebClient(installation.botToken)
        const targetChannel = dbUser.preferredChannelId || '#general'

        const meeting = await prisma.meeting.findUnique({
            where: {
                id: meetingId
            }
        })

        const meetingTitle = meeting?.title

        await slack.chat.postMessage({
            channel: targetChannel,
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "📝 Meeting Summary",
                        emoji: true
                    }
                },
                {
                    type: "section",
                    fields: [
                        {
                            type: "mrkdwn",
                            text: `*Meeting:*\n${meetingTitle}`
                        },
                        {
                            type: "mrkdwn",
                            text: `*Date:*\n${meeting?.startTime}`
                        }
                    ]
                },
                {
                    type: "divider"
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*📋 Summary:*\n${summary}`
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*✅ Action Items:*\n${actionItems}`
                    }
                },

                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: `Posted by ${user.firstName || 'User'} · ${new Date().toLocaleString()}`
                        }
                    ]
                }
            ]
        })

        return NextResponse.json({
            success: true,
            message: `Meeting summary posted to ${dbUser.preferredChannelName || '#general'}`
        })
    } catch (error) {
        console.error('error posting to slack:', error)

        return NextResponse.json({ error: 'failed to post to slack' }, { status: 500 })
    }
}