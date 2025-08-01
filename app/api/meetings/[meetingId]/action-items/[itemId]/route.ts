import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ meetingId: string; itemId: string }> }
) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const { meetingId, itemId } = await params
        const itemIdNumber = parseInt(itemId)

        const meeting = await prisma.meeting.findFirst({
            where: {
                id: meetingId,
                userId: userId
            }
        })

        if (!meeting) {
            return NextResponse.json({ error: 'meeting not found' }, { status: 404 })
        }

        const actionItems = (meeting.actionItems as any[]) || []
        const updatedActionItems = actionItems.filter((item: any) => item.id !== itemIdNumber)

        await prisma.meeting.update({
            where: {
                id: meetingId
            },
            data: {
                actionItems: updatedActionItems
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('error deleting action item:', error)
        return NextResponse.json({ error: 'internal error' }, { status: 500 })
    }
}