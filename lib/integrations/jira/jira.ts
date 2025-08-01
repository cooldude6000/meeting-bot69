import { ActionItemData } from "../types"

export class JiraAPI {
    private baseUrl = 'https://api.atlassian.com/ex/jira'

    async getProjectById(token: string, cloudId: string, projectId: string) {
        const response = await fetch(
            `${this.baseUrl}/${cloudId}/rest/api/3/project/${projectId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Jira project error: ', response.status, errorText)
            throw new Error(`failed to fetch project ${response.status}`)
        }

        return response.json()
    }

    async getAccessibleResources(token: string) {
        const response = await fetch(
            'https://api.atlassian.com/oauth/token/accessible-resources',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        )
        if (!response.ok) {
            const errorText = await response.text()
            console.error('Jira resourcwes error:', response.status, errorText)
            throw new Error(`Failed to fetch resources: ${response.status}`)
        }

        return response.json()
    }

    async getProjects(token: string, cloudId: string) {
        const response = await fetch(
            `${this.baseUrl}/${cloudId}/rest/api/3/project/search`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Jira projects error: ', response.status, errorText)
            throw new Error(`failed to fetch projects ${response.status}`)
        }

        return response.json()
    }

    async getCurrentUser(token: string, cloudId: string) {
        const response = await fetch(
            `${this.baseUrl}/${cloudId}/rest/api/3/myself`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Jira user error: ', response.status, errorText)
            throw new Error(`failed to fetch user ${response.status}`)
        }

        return response.json()
    }

    async createProject(token: string, cloudId: string, name: string, key: string) {
        const currentUser = await this.getCurrentUser(token, cloudId)

        const response = await fetch(
            `${this.baseUrl}/${cloudId}/rest/api/3/project`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    key: key,
                    name: name,
                    projectTypeKey: "software",
                    projectTemplateKey: "com.pyxis.greenhopper.jira:basic-software-development-template",
                    description: "Create via Meeting Bot",
                    leadAccountId: currentUser.accountId,
                    assigneeType: "PROJECT_LEAD"
                })
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Jira create project error: ', response.status, errorText)
            throw new Error(`failed to create project: ${response.status} - ${errorText}`)
        }

        return response.json()
    }

    async createIssue(token: string, cloudId: string, projectKey: string, data: ActionItemData) {
        const response = await fetch(
            `${this.baseUrl}/${cloudId}/rest/api/3/issue`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        project: {
                            key: projectKey
                        },
                        summary: data.title,
                        description: {
                            type: 'doc',
                            version: 1,
                            content: [
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: data.description || 'Action item from meeting'
                                        }
                                    ]
                                }
                            ]
                        },
                        issuetype: {
                            name: 'Task'
                        }
                    }
                })
            }
        )

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Jira create issue error: ', response.status, errorText)
            throw new Error(`failed to create issue: ${response.status} - ${errorText}`)
        }

        return response.json()
    }


}