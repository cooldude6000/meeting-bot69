import { prisma } from "@/lib/db"
import { isDuplicateEvent } from "../utils/deduplicate"

export async function handleAppMention({ event, say, client }: any) {
    try {
        const eventId = `app_mention-${event.channel}-${event.user}`
        const eventTs = event.event_ts || event.ts

        if (isDuplicateEvent(eventId, eventTs)) {
            return
        }

        const authTest = await client.auth.test()
        if (event.user === authTest.user_id) {
            return
        }

        const slackUserId = event.user

        if (!slackUserId) {
            return
        }

        const text = event.text || ''

        const cleanText = text.replace(/<@[^>]+>/g, '').trim()

        if (!cleanText) {
            await say("👋 Hi! Ask me anything about your meetings. For example:\n· What were the key decisions in yesterday's meeting?\n· Summarize yesterday's meeting action items\n· Who attended the product planning session?")
            return
        }

        const userInfo = await client.users.info({ user: slackUserId })
        const userEmail = userInfo.user?.profile?.email

        if (!userEmail) {
            await say("Sorry, I cant access ur email. Please make sure your slack email is visible on your profile settings.")
            return
        }

        const user = await prisma.user.findFirst({
            where: {
                email: userEmail
            }
        })

        if (!user) {
            await say({
                text: "Account not found",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `👋 Hi! I coant find an accoutn with email *${userEmail}*.\n\nPlease sign up first, then you can chat with me here!`
                        }
                    },
                    {
                        type: "context",
                        elements: [{
                            type: "mrkdwn",
                            text: "Once you have an account, I can help you with meeting summaries, action items, and more!"
                        }]
                    }
                ]
            })
            return
        }

        const { team_id: teamId } = await client.auth.test()
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                slackUserId: slackUserId,
                slackTeamId: teamId as string,
                slackConnected: true
            }
        })
        await say("🤖 Searching through your meetings...")

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rag/chat-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: cleanText,
                userId: user.id
            })
        })

        if (!response.ok) {
            throw new Error(`RAG API failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.answer) {

            const answer = data.answer

            await say({
                text: "Meeting Assistant Response",
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `🤖 *Meeting Assistant*\n\n${answer}`
                        }
                    },
                    {
                        type: "divider"
                    },
                    {
                        type: "context",
                        elements: [{
                            type: "mrkdwn",
                            text: `💡 Ask me about meetings, decisions, action items or participants`
                        }]
                    },
                ]
            })
        } else {
            await say('sorry, i encountered an error searching through your meetings')
        }
    } catch (error) {
        console.error('app mention handler error:', error)
        await say('sory, something went wrong. please try again')
    }
}