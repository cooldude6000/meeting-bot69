import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const clientId = process.env.JIRA_CLIENT_ID

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/jira/callback`

    const scope = 'read:jira-work write:jira-work manage:jira-project manage:jira-configuration read:jira-user offline_access'

    const state = userId

    const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}&response_type=code&prompt=consent`

    return NextResponse.redirect(authUrl)
}