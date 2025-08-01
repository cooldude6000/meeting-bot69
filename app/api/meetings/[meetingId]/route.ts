import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ meetingId: string }> }
) {
    try {
        const { userId: clerkUserId } = await auth()

        const { meetingId } = await params

        const meeting = await prisma.meeting.findUnique({
            where: {
                id: meetingId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        clerkId: true
                    }
                }
            }
        })

        if (!meeting) {
            return NextResponse.json({ error: 'meeting not found' }, { status: 404 })
        }

        const responseData = {
            ...meeting,
            isOwner: clerkUserId === meeting.user?.clerkId
        }

        return NextResponse.json(responseData)
    } catch (error) {
        console.error('api error:', error)
        return NextResponse.json({ error: 'failed to fetch meeting' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { meetingId: string } }
) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'not authenticated' }, { status: 401 })
        }

        const { meetingId } = params

        const meeting = await prisma.meeting.findUnique({
            where: {
                id: meetingId
            },
            include: {
                user: true
            }
        })

        if (!meeting) {
            return NextResponse.json({ error: 'meeting not found' }, { status: 404 })
        }

        if (meeting.user.clerkId !== userId) {
            return NextResponse.json({ error: 'not authorized to delete this meeting' }, { status: 403 })
        }

        await prisma.meeting.delete({
            where: {
                id: meetingId
            }
        })

        return NextResponse.json({
            success: true,
            message: 'meeting deleted succesfully'
        })

    } catch (error) {
        console.error('failed to delere meeting', error)
        return NextResponse.json({ error: 'failed to delete meeting' }, { status: 500 })
    }
}