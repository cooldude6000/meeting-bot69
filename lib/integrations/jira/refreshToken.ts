import { prisma } from "@/lib/db";
import { UserIntegration } from "@prisma/client";

export async function refreshJiraToken(integration: UserIntegration) {
    try {
        const response = await fetch('https://auth.atlassian.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'refresh_token',
                client_id: process.env.JIRA_CLIENT_ID!,
                client_secret: process.env.JIRA_CLIENT_SECRET!,
                refresh_token: integration.refreshToken!,
            }),
        })

        const data = await response.json()

        if (response.ok) {
            const updatedIntegration = await prisma.userIntegration.update({
                where: {
                    id: integration.id
                },
                data: {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresAt: new Date(Date.now() + data.expires_in * 1000)
                }
            })

            return updatedIntegration
        } else {
            console.error('failed to refresh jira token:', data)
            throw new Error('token refreshfailed')
        }
    } catch (error) {
        console.error('error refreshing jira token', error)
        throw error
    }
}