import { prisma } from "@/lib/db"

export async function authorizeSlack(source: { teamId?: string }) {
    try {
        const { teamId } = source

        if (!teamId) {
            throw new Error('No team ID provided')
        }
        const installation = await prisma.slackInstallation.findUnique({
            where: {
                teamId
            }
        })

        if (!installation || !installation.active) {
            console.error('installaion not found or inactive for the team:', teamId)
            throw new Error(`installation not found for team: ${teamId}`)
        }

        return {
            botToken: installation.botToken,
            teamId: installation.teamId
        }
    } catch (error) {
        console.error('auth error:', error)
        throw error
    }
}