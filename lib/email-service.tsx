import MeetingSummaryEmailNew from '@/app/components/email/meeting-summary'
import { render } from '@react-email/render'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface EmailData {
    userEmail: string
    userName: string
    meetingTitle: string
    summary: string
    actionItems: Array<{
        id: number
        text: string
    }>
    meetingId: string
    meetingDate: string
}

export async function sendMeetingSummaryEmail(data: EmailData) {
    try {
        const emailHtml = await render(
            <MeetingSummaryEmailNew
                userName={data.userName}
                meetingTitle={data.meetingTitle}
                summary={data.summary}
                actionItems={data.actionItems}
                meetingId={data.meetingId}
                meetingDate={data.meetingDate}
            />
        )

        const result = await resend.emails.send({
            from: 'Meeting Bot <onboarding@resend.dev>',
            to: [data.userEmail],
            replyTo: 'gowreesh100@gmail.com',
            subject: `Meeting Summary Ready - ${data.meetingTitle}`,
            html: emailHtml,
            tags: [
                {
                    name: 'category',
                    value: 'meeting-summary'
                },
                {
                    name: 'meeting-id',
                    value: data.meetingId
                }
            ]
        })

        return result
    } catch (error) {
        console.error('error saendign email:', error)
        throw error
    }
}