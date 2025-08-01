import { useUsage } from '@/app/contexts/UsageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import React from 'react'

interface ChatInputProps {
    chatInput: string
    onInputChange: (value: string) => void
    onSendMessage: () => void
    isLoading: boolean
}

function ChatInput({
    chatInput,
    onInputChange,
    onSendMessage,
    isLoading
}: ChatInputProps) {

    const { canChat, usage, limits } = useUsage()
    return (
        <div className='p-6'>
            {!canChat && usage && (
                <div className='max-w-4xl mx-auto mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
                    <p className='text-sm text-orange-600 dark:text-orange-400 text-center'>
                        Daily limit reached ({usage.chatMessagesToday}/{limits.chatMessages} messages used).
                        <a href="/pricing" className='underline ml-1'>Upgrade your plan</a> to continue chatting.

                    </p>
                </div>
            )}

            <div className='flex gap-3 max-w-4xl mx-auto'>
                <Input
                    type='text'
                    value={chatInput}
                    onChange={e => onInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                    placeholder={canChat ? 'Ask about any meeting - deadlines, decisions, action items, participants...' : 'Daily chat limit reached - upgrade to continue'}
                    className='flex-1'
                    disabled={isLoading || !canChat}
                />

                <Button
                    onClick={onSendMessage}
                    disabled={isLoading || !canChat}
                    className='px-4 py-3'

                >
                    <Send className='h-4 w-4' />
                </Button>

            </div>
        </div>
    )
}

export default ChatInput
