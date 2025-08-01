import React from 'react'
import { ActionItem, useActionItems } from '../../hooks/useActionItems'
import { Button } from '@/components/ui/button'
import ActionItemsList from './ActionItemsList'
import AddActionItemInput from './AddActionItemInput'
import { toast } from 'sonner'

export interface ActionItemsProps {
    actionItems: ActionItem[]
    onDeleteItem: (id: number) => void
    onAddItem: (text: string) => void
    meetingId: string
}

function ActionItems({
    actionItems,
    onDeleteItem,
    onAddItem,
    meetingId
}: ActionItemsProps) {
    const {
        integrations,
        integrationsLoaded,
        loading,
        setLoading,
        showAddInput,
        setShowAddInput,
        newItemText,
        setNewItemText
    } = useActionItems(meetingId)

    const addToIntegration = async (platform: string, actionItem: ActionItem) => {
        setLoading(prev => ({ ...prev, [`${platform}-${actionItem.id}`]: true }))
        try {
            toast(`✅ Action item added to ${platform}`, {
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
            const response = await fetch('/api/integrations/action-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    platform,
                    actionItem: actionItem.text,
                    meetingId
                })
            })
        } finally {
            setLoading(prev => ({ ...prev, [`${platform}-${actionItem.id}`]: false }))
        }
    }

    const handleAddNewItem = async () => {
        if (!newItemText.trim()) {
            return
        }

        try {
            toast(`✅ Action item added`, {
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
            const response = await fetch(`/api/meetings/${meetingId}/action-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: newItemText
                })
            })

            if (response.ok) {
                onAddItem(newItemText)
                setNewItemText('')
                setShowAddInput(false)
            }
        } catch (error) {
            console.error('failed to add action item:', error)
        }
    }

    const handleDeleteItem = async (id: number) => {
        try {
            toast(`✅ Action item deleted`, {
                action: {
                    label: "OK",
                    onClick: () => { },
                },
            })
            const response = await fetch(`/api/meetings/${meetingId}/action-items/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                onDeleteItem(id)
            }
        } catch (error) {
            console.error('failed to delete action item:', error)
        }
    }

    const hasConnectedIntegrations = integrations.length > 0

    if (!integrationsLoaded) {
        return (
            <div className='bg-card rounded-lg p-6 border border-border mb-8'>
                <h3 className='text-lg font-semibold text-foreground mb-4'>
                    Action Items
                </h3>

                <div className='space-y-4'>
                    {actionItems.map((item) => (
                        <div key={item.id} className='group relative'>
                            <div className='flex items-center gap-3'>
                                <p className='flex-1 text-sm leading-relaxed text-foreground'>
                                    {item.text}
                                </p>
                                <div className='animate-pulse'>
                                    <div className='h-6 w-20 bg-muted rounded'></div>
                                </div>

                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 text-destructive rounded transition-all'
                                    disabled
                                >

                                </Button>

                            </div>
                        </div>
                    ))}

                    <div className='animate-pulse'>
                        <div className='h-8 bg-muted rounded-lg'></div>
                    </div>

                </div>

            </div>
        )
    }

    return (
        <div className='bg-card rounded-lg p-6 border border-border mb-8'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
                Action Items
            </h3>

            <ActionItemsList
                actionItems={actionItems}
                integrations={integrations}
                loading={loading}
                addToIntegration={addToIntegration}
                handleDeleteItem={handleDeleteItem}
            />

            <AddActionItemInput
                showAddInput={showAddInput}
                setShowAddInput={setShowAddInput}
                newItemText={newItemText}
                setNewItemText={setNewItemText}
                onAddItem={handleAddNewItem}
            />

            {!hasConnectedIntegrations && actionItems.length > 0 && (
                <div className='mt-4 p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30'>
                    <p className='text-xs text-muted-foreground text-center'>
                        <a href="/integrations" className='text-primary hover:underline'>
                            Connect Integrations
                        </a> to add action items to your tools
                    </p>
                </div>
            )}

        </div>
    )
}

export default ActionItems
