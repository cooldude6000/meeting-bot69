import { ActionItemData } from "../types"

export class AsanaAPI {
    private baseUrl = 'https://app.asana.com/api/1.0'

    async getWorkspaces(token: string) {
        const response = await fetch(
            `${this.baseUrl}/workspaces`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error('Failed to fetch workspaces')
        }

        return response.json()
    }

    async getProjects(token: string, workspaceId: string) {
        const response = await fetch(
            `${this.baseUrl}/projects?workspace=${workspaceId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error('Failed to fetch projects')
        }

        return response.json()
    }

    async createProject(token: string, workspaceId: string, name: string) {
        const response = await fetch(
            `${this.baseUrl}/projects`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        name: name,
                        workspace: workspaceId
                    }
                })
            }
        )
        if (!response.ok) {
            throw new Error('Failed to create project')
        }

        return response.json()

    }

    async createTask(token: string, projectId: string, data: ActionItemData) {
        const response = await fetch(
            `${this.baseUrl}/tasks`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        name: data.title,
                        notes: data.description || 'Action item from the meeting',
                        projects: [projectId]
                    }
                })
            }
        )
        if (!response.ok) {
            throw new Error('Failed to create task')
        }

        return response.json()
    }
}