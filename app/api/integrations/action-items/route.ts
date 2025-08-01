import { prisma } from "@/lib/db";
import { AsanaAPI } from "@/lib/integrations/asana/asana";
import { JiraAPI } from "@/lib/integrations/jira/jira";
import { refreshTokenIfNeeded } from "@/lib/integrations/refreshTokenIfNeeded";
import { TrelloAPI } from "@/lib/integrations/trello/trello";
import { auth } from "@clerk/nextjs/server";
import { channel } from "diagnostics_channel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userId } = await auth()

    const { platform, actionItem, meetingId } = await request.json()

    if (!userId) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    let integration = await prisma.userIntegration.findUnique({
        where: {
            userId_platform: {
                userId,
                platform
            }
        }
    })

    if (!integration) {
        return NextResponse.json({ error: 'integration not found' }, { status: 400 })
    }

    if (platform === 'jira' || platform === 'asana') {
        try {
            integration = await refreshTokenIfNeeded(integration)
        } catch (error) {
            console.error(`token refresh failed for ${platform}:`, error)
            return NextResponse.json({ error: `please reconnet your ${platform} integration` }, { status: 401 })
        }
    }

    try {
        if (platform === 'trello') {
            if (!integration.boardId) {
                return NextResponse.json({ error: 'board not configured' }, { status: 400 })
            }

            const trello = new TrelloAPI()

            const lists = await trello.getBoardLists(integration.accessToken, integration.boardId)

            const todoList = lists.find((list: any) =>
                list.name.toLowerCase().includes('to do') ||
                list.name.toLowerCase().includes('todo')
            ) || lists[0]

            if (!todoList) {
                return NextResponse.json({ error: 'no suitable list found' }, { status: 400 })
            }

            await trello.createCard(integration.accessToken, todoList.id, {
                title: actionItem,
                description: `Action item from meeting ${meetingId || 'Unkown'}`
            })
        }

        else if (platform === 'jira') {
            if (!integration.projectId || !integration.workspaceId) {
                return NextResponse.json({ error: 'project not configured' }, { status: 400 })
            }

            const jira = new JiraAPI()

            const title = actionItem || 'Untitled action item'
            const description = `Action item from meeting ${meetingId || 'Unkown'}`

            const issue = await jira.createIssue(
                integration.accessToken,
                integration.workspaceId,
                integration.projectId,
                {
                    title,
                    description
                }
            )
        }

        else if (platform === 'asana') {
            if (!integration.projectId) {
                return NextResponse.json({ error: 'project not configured' }, { status: 400 })
            }

            const asana = new AsanaAPI()

            await asana.createTask(integration.accessToken, integration.projectId, {
                title: actionItem,
                description: `Action item from meeting ${meetingId || 'Unkown'}`
            })
        }

        else if (platform === 'slack') {
            if (!integration.boardId) {
                return NextResponse.json({ error: 'slack channel not configured' }, { status: 400 })
            }

            const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${integration.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channel: integration.boardId,
                    text: `📋 *Action Item from Meeting ${meetingId || 'Unknown'}*\n${actionItem}`
                })
            })

            const slackResult = await slackResponse.json()
            if (!slackResponse.ok) {
                throw new Error(`Slack API error: ${slackResult.error}`)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(`Error creating action item in ${platform}: `, error)
        return NextResponse.json({ error: `failed to create action item in ${platform}` }, { status: 500 })
    }
}