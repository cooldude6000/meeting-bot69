import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { WebClient } from '@slack/web-api'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')

        const host = request.headers.get('host')
        const isLocal = host?.includes('localhost') //maybe use NODE_ENV here?
        const protocol = isLocal ? 'http' : 'https'
        const baseUrl = `${protocol}://${host}`

        if (error) {
            console.error('slack oauth error:', error)
            return NextResponse.redirect(`${baseUrl}/?slack=error`)
        }

        if (!code) {
            return NextResponse.json({ error: 'no authorization code' }, { status: 400 })
        }

        const redirectUri = `${baseUrl}/api/slack/oauth`

        const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: process.env.SLACK_CLIENT_ID!,
                client_secret: process.env.SLACK_CLIENT_SECRET!,
                code: code,
                redirect_uri: redirectUri
            })
        })

        const tokenData = await tokenResponse.json()

        if (!tokenData.ok) {
            console.error('failed to exchange oauth code:', tokenData.error)
            return NextResponse.redirect(`${baseUrl}/?slack=error`)
        }

        const installation = await prisma.slackInstallation.upsert({
            where: {
                teamId: tokenData.team.id
            },
            update: {
                teamName: tokenData.team.name,
                botToken: tokenData.access_token,
                installedBy: tokenData.authed_user.id,
                installerName: tokenData.authed_user.name || 'Unknown',
                active: true,
                updatedAt: new Date()
            },
            create: {
                teamId: tokenData.team.id,
                teamName: tokenData.team.name,
                botToken: tokenData.access_token,
                installedBy: tokenData.authed_user.id,
                installerName: tokenData.authed_user.name || 'Unknown',
                active: true,
            }
        })

        try {
            const slack = new WebClient(tokenData.access_token)
            const userInfo = await slack.users.info({ user: tokenData.authed_user.id })

            if (userInfo.user?.profile?.email) {
                await prisma.user.updateMany({
                    where: {
                        email: userInfo.user.profile.email
                    },
                    data: {
                        slackUserId: tokenData.authed_user.id,
                        slackTeamId: tokenData.team.id,
                        slackConnected: true
                    }
                })
            }
        } catch (error) {
            console.error('failed to link user during oauth:', error)
        }

        const returnTo = state?.startsWith('return=') ? state.split('return=')[1] : null

        if (returnTo === 'integrations') {
            return NextResponse.redirect(`${baseUrl}/integrations?setup=slack`)
        } else {
            return NextResponse.redirect(`${baseUrl}/?slack=installed`)
        }
    } catch (error) {
        console.error('slack oauth error', error)

        const host = request.headers.get('host')
        const isLocal = host?.includes('localhost')
        const protocol = isLocal ? 'http' : 'https'
        const baseUrl = `${protocol}://${host}`

        return NextResponse.redirect(`${baseUrl}/?slack=error`)
    }
}