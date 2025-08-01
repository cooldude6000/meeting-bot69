import React from 'react'

interface Message {
    id: number
    content: string
    isBot: boolean
    timestamp: Date
}

interface ChatMessagesProps {
    messages: Message[]
    isLoading: boolean
}

function ChatMessages({
    messages,
    isLoading
}: ChatMessagesProps) {
    return (
        <div className='space-y-4'>
            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] rounded-lg p-4 ${message.isBot
                        ? 'bg-card border border-border text-foreground'
                        : 'bg-primary text-primary-foreground'
                        }`}>
                        <p className='text-sm leading-relaxed'>{message.content}</p>

                    </div>

                </div>
            ))}

            {isLoading && (
                <div className='flex justify-start'>
                    <div className='bg-card border border-border rounded-lg p-4'>
                        <p className='text-sm text-muted-foreground'>🤖 Searching through all your meetings...</p>

                    </div>

                </div>
            )}

        </div>
    )
}

export default ChatMessages
