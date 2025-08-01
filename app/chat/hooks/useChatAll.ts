import { useChatCore } from "@/app/hooks/chat/useChatCore"

const chatSuggestions = [
    "What were the key decisions made in yesterday's product meeting?",
    "Summarize the action items from last week's standup",
    "Who attended the client presentation on Monday?",
    "What deadlines were discussed in recent meetings?",
    "Generate a follow-up email for the marketing meeting",
    "What feedback was given about the new feature?"
]

export default function useChatAll() {
    const chat = useChatCore({
        apiEndpoint: '/api/rag/chat-all',
        getRequestBody: (input) => ({ question: input })
    })

    return {
        ...chat,
        chatSuggestions
    }
}