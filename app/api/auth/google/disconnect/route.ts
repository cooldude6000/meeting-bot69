import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Not authed" }, { status: 401 })
        }

        await prisma.user.update({
            where: {
                clerkId: userId
            },
            data: {
                calendarConnected: false,
                googleAccessToken: null,
                googleRefreshToken: null,
                googleTokenExpiry: null
            }
        })

        return NextResponse.json({ success: true, message: "cal disconnected succesfuly" })
    } catch (error) {
        console.error('disconnect error:', error)
        return NextResponse.json({ error: 'failed to disconnect calendar ' }, { status: 500 })
    }
}