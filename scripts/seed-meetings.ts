import * as path from "path";
import * as fs from 'fs'
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";

async function seedMeetings() {
    try {
        const dataPath = path.join(__dirname, 'data')

        const transcript1 = JSON.parse(fs.readFileSync(path.join(dataPath, 'transcripts', 'transcript1.json'), 'utf8'))
        const transcript2 = JSON.parse(fs.readFileSync(path.join(dataPath, 'transcripts', 'transcript2.json'), 'utf8'))
        const transcript3 = JSON.parse(fs.readFileSync(path.join(dataPath, 'transcripts', 'transcript3.json'), 'utf8'))

        const summaryData = JSON.parse(fs.readFileSync(path.join(dataPath, 'summaries.json'), 'utf8'))
        const actionItems = JSON.parse(fs.readFileSync(path.join(dataPath, 'action-items.json'), 'utf8'))
        const titles = JSON.parse(fs.readFileSync(path.join(dataPath, 'title.json'), 'utf8'))

        const userId = 'user_2zRytJaBexiUzgf1VncfMZo4C1v'
        const recordingUrl = 'https://meetingbot1.s3.eu-north-1.amazonaws.com/test-audio.mp3'

        const now = new Date()
        const startTime = new Date(now.getTime() - 30 * 60 * 1000)
        const endTime = new Date(now.getTime() - 5 * 60 * 1000)

        const meetings = [
            {
                transcript: transcript1,
                title: titles[0].title,
                description: titles[0].description
            },
            {
                transcript: transcript2,
                title: titles[1].title,
                description: titles[1].description
            },
            {
                transcript: transcript3,
                title: titles[2].title,
                description: titles[2].description
            }
        ]

        for (let i = 0; i < meetings.length; i++) {
            const meeting = meetings[i]

            await prisma.meeting.create({
                data: {
                    userId: userId,
                    title: meeting.title,
                    description: meeting.description,
                    meetingUrl: 'https://meet.google.com/cug-hszq-vqv',
                    startTime: startTime,
                    endTime: endTime,

                    calendarEventId: randomUUID(),
                    isFromCalendar: true,

                    botScheduled: true,
                    botSent: true,
                    botId: randomUUID(),
                    botJoinedAt: startTime,

                    meetingEnded: true,
                    transcriptReady: true,
                    transcript: meeting.transcript,
                    recordingUrl: recordingUrl,

                    summary: summaryData.summary,
                    actionItems: actionItems,
                    processed: true,
                    processedAt: endTime,
                    emailSent: true,
                    emailSentAt: endTime,
                    ragProcessed: false
                }
            })
        }
    } catch (error) {
        console.error('error seeding meetings bruh', error)
    }
}

seedMeetings()