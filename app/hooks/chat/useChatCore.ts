import { useUsage } from "@/app/contexts/UsageContext"
import { useState } from "react"

export interface ChatMessage {
    id: number
    content: string
    isBot: boolean
    timestamp: Date
}

interface UseChatCoreOptions {
    apiEndpoint: string
    getRequestBody: (input: string) => any
}

export function useChatCore({
    apiEndpoint,
    getRequestBody,
}: UseChatCoreOptions) {
    const [chatInput, setChatInput] = useState('')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [showSuggestions, setShowSuggestions] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const { canChat, incrementChatUsage } = useUsage()

    const handleSendMessage = async () => {
        if (!chatInput.trim() || isLoading) {
            return
        }

        if (!canChat) {
            return
        }

        setShowSuggestions(false)
        setIsLoading(true)

        const newMessage: ChatMessage = {
            id: messages.length + 1,
            content: chatInput,
            isBot: false,
            timestamp: new Date()
        }

        setMessages([...messages, newMessage])

        const currentInput = chatInput

        setChatInput('')

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getRequestBody(currentInput))
            })

            const data = await response.json()

            if (response.ok) {
                await incrementChatUsage()

                const botMessage: ChatMessage = {
                    id: messages.length + 2,
                    content: data.answer || data.response,
                    isBot: true,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, botMessage])
            } else {
                if (data.upgradeRequired) {
                    const upgradeMessage: ChatMessage = {
                        id: messages.length + 2,
                        content: `${data.error} Visit the Pricing page to upgrade your plan and continue chatting!`,
                        isBot: true,
                        timestamp: new Date()
                    }
                    setMessages(prev => [...prev, upgradeMessage])
                } else {
                    const errorMessage: ChatMessage = {
                        id: messages.length + 2,
                        content: data.error || 'Sorry, I encountered an error. Please try again.',
                        isBot: true,
                        timestamp: new Date()
                    }
                    setMessages(prev => [...prev, errorMessage])
                }
            }

        } catch (error) {
            console.error('chat error:', error)
            const errorMessage: ChatMessage = {
                id: messages.length + 2,
                content: 'Sorry, I could not connect to the server. please check your connection and try again.',
                isBot: true,
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        if (!canChat) {
            return
        }

        setShowSuggestions(false)
        setChatInput(suggestion)
    }

    const handleInputChange = (value: string) => {
        setChatInput(value)

        if (value.length > 0 && showSuggestions) {
            setShowSuggestions(false)
        }
    }

    return {
        chatInput,
        setChatInput,
        messages,
        setMessages,
        showSuggestions,
        setShowSuggestions,
        isLoading,
        setIsLoading,
        handleSendMessage,
        handleSuggestionClick,
        handleInputChange,
        canChat
    }
}