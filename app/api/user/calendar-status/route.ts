import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ connected: false })
        }

        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            },
            select: {
                calendarConnected: true,
                googleAccessToken: true
            }
        })

        return NextResponse.json({
            connected: user?.calendarConnected && !!user.googleAccessToken
        })
    } catch (error) {
        return NextResponse.json({ connected: false })
    }
}