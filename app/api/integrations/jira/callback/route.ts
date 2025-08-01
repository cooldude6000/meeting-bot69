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
        const tokenResponse = await fetch('https://auth.atlassian.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.JIRA_CLIENT_ID!,
                client_secret: process.env.JIRA_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/jira/callback`,
                code: code
            })
        })

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text()
            console.error('token exchange failed:', errorText)
            throw new Error('failed to exchange code for token')
        }

        const tokenData = await tokenResponse.json()

        const resourcesResponse = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Accept': 'application/json'
            }
        })

        if (!resourcesResponse.ok) {
            throw new Error('failed to get accessible resources')
        }

        const resources = await resourcesResponse.json()
        const cloudId = resources[0]?.id

        if (!cloudId) {
            throw new Error('No accesible jira reosurces found')
        }

        await prisma.userIntegration.upsert({
            where: {
                userId_platform: {
                    userId,
                    platform: 'jira'
                }
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
                workspaceId: cloudId,
                updatedAt: new Date()
            },
            create: {
                userId,
                platform: 'jira',
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
                workspaceId: cloudId,
            }
        })

        return NextResponse.redirect(new URL('/integrations?success=jira_connected&setup=jira', process.env.NEXT_PUBLIC_APP_URL))
    } catch (error) {
        console.error('error saving jira integration:', error)
        return NextResponse.redirect(new URL('/integrations?error=save_failed', process.env.NEXT_PUBLIC_APP_URL))
    }
}