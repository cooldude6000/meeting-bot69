import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { userId } = await auth()

    const { searchParams } = new URL(request.url)

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!userId || !code || state !== userId) {
        return NextResponse.redirect(new URL('/integrations?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL))
    }

    try {
        const tokenResponse = await fetch('https://app.asana.com/-/oauth_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.ASANA_CLIENT_ID!,
                client_secret: process.env.ASANA_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/asana/callback`,
                code: code
            })
        })

        if (!tokenResponse.ok) {
            throw new Error('failed to exchange code for token')
        }

        const tokenData = await tokenResponse.json()

        await prisma.userIntegration.upsert({
            where: {
                userId_platform: {
                    userId,
                    platform: 'asana'
                }
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                updatedAt: new Date()
            },
            create: {
                userId,
                platform: 'asana',
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
            }
        })

        return NextResponse.redirect(new URL('/integrations?success=asana_connected&setup=asana', process.env.NEXT_PUBLIC_APP_URL))
    } catch (error) {
        console.error('error saving asana integration:', error)
        return NextResponse.redirect(new URL('/integrations?error=save_failed', process.env.NEXT_PUBLIC_APP_URL))
    }
}