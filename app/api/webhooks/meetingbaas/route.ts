import { processMeetingTranscript } from "@/lib/ai-processor";
import { prisma } from "@/lib/db";
import { sendMeetingSummaryEmail } from "@/lib/email-service-free";
import { processTranscript } from "@/lib/rag";
import { incrementMeetingUsage } from "@/lib/usage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const webhook = await request.json()

        if (webhook.event === 'complete') {
            const webhookData = webhook.data

            const meeting = await prisma.meeting.findFirst({
                where: {
                    botId: webhookData.bot_id
                },
                include: {
                    user: true
                }
            })

            if (!meeting) {
                console.error('meeting not found for bot id:', webhookData.bot_id)
                return NextResponse.json({ error: 'meeting not found' }, { status: 404 })
            }

            await incrementMeetingUsage(meeting.userId)

            if (!meeting.user.email) {
                console.error('user email not found for this meeting', meeting.id)
                return NextResponse.json({ error: 'user email not found' }, { status: 400 })
            }

            await prisma.meeting.update({
                where: {
                    id: meeting.id
                },
                data: {
                    meetingEnded: true,
                    transcriptReady: true,
                    transcript: webhookData.transcript || null,
                    recordingUrl: webhookData.mp4 || null,
                    speakers: webhookData.speakers || null
                }
            })

            if (webhookData.transcript && !meeting.processed) {
                try {
                    const processed = await processMeetingTranscript(webhookData.transcript)

                    let transcriptText = ''

                    if (Array.isArray(webhookData.transcript)) {
                        transcriptText = webhookData.transcript
                            .map((item: any) => `${item.speaker || 'Speaker'}: ${item.words.map((w: any) => w.word).join(' ')}`)
                            .join('\n')
                    } else {
                        transcriptText = webhookData.transcript
                    }

                    try {
                        await sendMeetingSummaryEmail({
                            userEmail: meeting.user.email,
                            userName: meeting.user.name || 'User',
                            meetingTitle: meeting.title,
                            summary: processed.summary,
                            actionItems: processed.actionItems,
                            meetingId: meeting.id,
                            meetingDate: meeting.startTime.toLocaleDateString()
                        })

                        await prisma.meeting.update({
                            where: {
                                id: meeting.id
                            },
                            data: {
                                emailSent: true,
                                emailSentAt: new Date()
                            }
                        })
                    } catch (emailError) {
                        console.error('failed to send the email:', emailError)
                    }

                    await processTranscript(meeting.id, meeting.userId, transcriptText, meeting.title)

                    await prisma.meeting.update({
                        where: {
                            id: meeting.id
                        },
                        data: {
                            summary: processed.summary,
                            actionItems: processed.actionItems,
                            processed: true,
                            processedAt: new Date(),
                            ragProcessed: true,
                            ragProcessedAt: new Date()
                        }
                    })


                } catch (processingError) {
                    console.error('failed to process the transcript:', processingError)

                    await prisma.meeting.update({
                        where: {
                            id: meeting.id
                        },
                        data: {
                            processed: true,
                            processedAt: new Date(),
                            summary: 'processing failed. please check the transcript manually.',
                            actionItems: []
                        }
                    })
                }
            }

            return NextResponse.json({
                success: true,
                message: 'meeting processed succesfully',
                meetingId: meeting.id
            })
        }
        return NextResponse.json({
            success: true,
            message: 'webhook recieved but no action needed bro'
        })
    } catch (error) {
        console.error('webhook processing errir:', error)
        return NextResponse.json({ error: 'internal server error' }, { status: 500 })
    }
}