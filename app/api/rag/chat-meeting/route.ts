import { chatWithMeeting } from "@/lib/rag";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
    }

    const { meetingId, question } = await request.json()

    if (!meetingId || !question) {
        return NextResponse.json({ error: 'Missing meetingId or question' }, { status: 400 })
    }

    try {
        const response = await chatWithMeeting(userId, meetingId, question)

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error in chat:', error)
        return NextResponse.json({ error: 'Faled to process question' }, { status: 500 })
    }
}