import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import React from 'react'

interface AddActionItemInputProps {
    showAddInput: boolean
    setShowAddInput: (show: boolean) => void
    newItemText: string
    setNewItemText: (text: string) => void
    onAddItem: () => void
}

function AddActionItemInput({
    showAddInput,
    setShowAddInput,
    newItemText,
    setNewItemText,
    onAddItem
}: AddActionItemInputProps) {

    if (showAddInput) {

        return (
            <div className='flex items-center gap-2 p-3 bg-muted/30 rounded-lg'>
                <Input
                    type='text'
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder='Enter action item...'
                    className='flex-1'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onAddItem()
                        }
                        if (e.key === 'Escape') {
                            setShowAddInput(false)
                            setNewItemText('')
                        }
                    }}
                    autoFocus
                />
                <Button
                    onClick={onAddItem}
                    disabled={!newItemText.trim()}
                    size='sm'
                >
                    Add
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                        setShowAddInput(false)
                        setNewItemText('')
                    }}
                >
                    Cancel
                </Button>

            </div>
        )

    }
    return (
        <Button
            variant='ghost'
            className='flex items-center gap-3 w-full py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors group'
            onClick={() => setShowAddInput(true)}
        >
            <Plus className='h-4 w-4' />
            <span>Add Action Item</span>

        </Button>
    )
}

export default AddActionItemInput
