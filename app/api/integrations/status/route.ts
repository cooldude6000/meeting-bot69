import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await currentUser()

        if (!user) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const integrations = await prisma.userIntegration.findMany({
            where: {
                userId: user.id
            }
        })

        const allPlatforms = [
            { platform: 'trello', name: 'Trello', logo: '🔷', connected: false },
            { platform: 'jira', name: 'Jira', logo: '🔵', connected: false },
            { platform: 'asana', name: 'Asana', logo: '🟠', connected: false }
        ]

        const result: any[] = allPlatforms.map(platform => {
            const integration = integrations.find(i => i.platform === platform.platform)
            return {
                ...platform,
                connected: !!integration,
                boardName: integration?.boardName,
                projectName: integration?.projectName
            }
        })

        const dbUser = await prisma.user.findFirst({
            where: {
                clerkId: user.id
            }
        })

        if (dbUser?.slackConnected) {
            result.push({
                platform: 'slack',
                name: 'Slack',
                logo: '💬',
                connected: true,
                channelName: dbUser.preferredChannelName || 'Not Set'
            })
        } else {
            result.push({
                platform: 'slack',
                name: 'Slack',
                logo: '💬',
                connected: false,
            })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error('error fetching integration statsu:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 }
        )
    }
}