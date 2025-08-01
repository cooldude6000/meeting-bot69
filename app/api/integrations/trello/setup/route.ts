import { prisma } from "@/lib/db";
import { TrelloAPI } from "@/lib/integrations/trello/trello";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'unauthoarized' }, { status: 401 })
    }

    const integration = await prisma.userIntegration.findUnique({
        where: {
            userId_platform: {
                userId,
                platform: 'trello'
            }
        }
    })

    if (!integration) {
        return NextResponse.json({ error: 'not connected' }, { status: 400 })
    }

    try {
        const trello = new TrelloAPI()

        const boards = await trello.getBoards(integration.accessToken)

        return NextResponse.json({ boards })
    } catch (error) {
        console.error('error fetching trello boards:', error)
        return NextResponse.json({ error: 'failed to fetch boards' }, { status: 500 })
    }

}

export async function POST(request: NextRequest) {
    const { userId } = await auth()

    const { boardId, boardName, createNew } = await request.json()

    if (!userId) {
        return NextResponse.json({ error: 'unauthoarized' }, { status: 401 })
    }


    const integration = await prisma.userIntegration.findUnique({
        where: {
            userId_platform: {
                userId: userId,
                platform: 'trello'
            }
        }
    })
    if (!integration) {
        return NextResponse.json({ error: 'not connected' }, { status: 400 })
    }


    try {
        const trello = new TrelloAPI()

        let finalBoardId = boardId
        let finalBoardName = boardName

        if (createNew && boardName) {
            const newBoard = await trello.createBoard(integration.accessToken, boardName)

            finalBoardId = newBoard.id
            finalBoardName = newBoard.name
        }

        await prisma.userIntegration.update({
            where: {
                id: integration.id
            },
            data: {
                boardId: finalBoardId,
                boardName: finalBoardName
            }
        })

        return NextResponse.json({
            success: true,
            boardId: finalBoardId,
            boardName: finalBoardName
        })
    } catch (error) {
        console.error('Error setting up trello board:', error)
        return NextResponse.json({ error: 'Failed to setup board' }, { status: 500 })
    }
}