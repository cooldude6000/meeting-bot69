import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'unauthoarized' }, { status: 401 })
    }

    try {
        await prisma.userIntegration.delete({
            where: {
                userId_platform: {
                    userId,
                    platform: 'asana'
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error disconnecting asana:', error)
        return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
    }

}