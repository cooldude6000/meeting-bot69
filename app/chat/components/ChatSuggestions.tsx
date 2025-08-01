import React from 'react'

interface ChatSuggestionsProps {
    suggestions: string[]
    onSuggestionClick: (suggestion: string) => void
}

function ChatSuggestions({ suggestions, onSuggestionClick }: ChatSuggestionsProps) {
    return (
        <div className='flex flex-col items-center justify-center h-full space-y-8'>
            <div className='text-center'>
                <h2 className='text-xl font-semibold text-foreground mb-3'>
                    Ask AI chatbot any question about all your meetings
                </h2>

                <p className='text-muted-foreground'>
                    I can search across all your meetings to find information, summarize discussions, and answer questions
                </p>

            </div>

            <div className='grid grid-cols-2 gap-4 w-full max-w-3xl'>
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className='p-4 bg-card border border-border rounded-lg hover:bg-primary/10 hover:border-primary/30 transition-colors text-left group'
                    >
                        <p className='text-sm text-foreground group-hover:text-primary transition-colors'>
                            ⚡️ {suggestion}
                        </p>

                    </button>
                ))}

            </div>

        </div>
    )
}

export default ChatSuggestions
