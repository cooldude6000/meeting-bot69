import type { ActionItemData } from "../types"

export class TrelloAPI {
    private apiKey = process.env.TRELLO_API_KEY!

    private baseUrl = 'https://api.trello.com/1'

    async getBoards(token: string) {
        const response = await fetch(
            `${this.baseUrl}/members/me/boards?key=${this.apiKey}&token=${token}`
        )

        if (!response.ok) {
            throw new Error('failed to fetch boards')
        }

        return response.json()
    }

    async createBoard(token: string, name: string) {
        const response = await fetch(
            `${this.baseUrl}/boards?key=${this.apiKey}&token=${token}&name=${encodeURIComponent(name)}&defaultLists=true`,
            { method: 'POST' }

        )

        if (!response.ok) {
            throw new Error('failed to create boards')
        }

        return response.json()
    }

    async getBoardLists(token: string, boardId: string) {
        const response = await fetch(
            `${this.baseUrl}/boards/${boardId}/lists?key=${this.apiKey}&token=${token}`
        )

        if (!response.ok) {
            throw new Error('failed to fetch lists')
        }

        return response.json()
    }
    async createCard(token: string, listId: string, data: ActionItemData) {
        const response = await fetch(
            `${this.baseUrl}/cards?key=${this.apiKey}&token=${token}&idList=${listId}&name=${encodeURIComponent(data.title)}&desc=${encodeURIComponent(data.description || '')}`
            , {
                method: 'POST'
            }
        )

        if (!response.ok) {
            throw new Error('failed to create card')
        }

        return response.json()
    }
}