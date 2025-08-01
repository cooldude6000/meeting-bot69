import { UserIntegration } from "@prisma/client";
import { refreshAsanaToken } from "./asana/refreshToken";
import { refreshJiraToken } from "./jira/refreshToken";

export async function refreshTokenIfNeeded(integration: UserIntegration) {
    const now = new Date()
    const expiresAt = integration.expiresAt

    if (!expiresAt || now >= new Date(expiresAt.getTime() - 5 * 60 * 1000)) {
        switch (integration.platform) {
            case 'jira':
                return await refreshJiraToken(integration)
            case 'asana':
                return await refreshAsanaToken(integration)
            default:
                return integration
        }
    }

    return integration
}