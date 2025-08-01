import React from 'react'
import { Integration } from '../../hooks/useActionItems'
import { Button } from '@/components/ui/button'
import { ChevronDown, ExternalLink, Trash2 } from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface ActionItemRowProps {
    item: {
        id: number
        text: string
    }
    integrations: Integration[]
    loading: { [key: string]: boolean }
    addToIntegration: (platform: string, item: { id: number; text: string }) => void
    handleDeleteItem: (id: number) => void
}

function ActionItemRow({
    item,
    integrations,
    loading,
    addToIntegration,
    handleDeleteItem
}: ActionItemRowProps) {

    const hasConnectedIntegrations = integrations.length > 0
    return (
        <div className='group relative'>
            <div className='flex items-start gap-3'>
                <div className='w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0'></div>

                <p className='flex-1 text-sm leading-relaxed text-foreground'>
                    {item.text}
                </p>

                {hasConnectedIntegrations && (
                    <div className='transition-opacity relative'>
                        {integrations.length === 1 ? (
                            <Button
                                onClick={() => addToIntegration(integrations[0].platform, item)}
                                disabled={loading[`${integrations[0].platform}-${item.id}`]}
                                size='sm'
                                className='px-3 py-1 text-xs flex items-center gap-1'

                            >
                                {loading[`${integrations[0].platform}-${item.id}`] ? (
                                    'Adding...'
                                ) : (
                                    <>
                                        Add to {integrations[0].name}
                                        <ExternalLink className='h-3 w-3' />
                                    </>
                                )}

                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size='sm'
                                        variant='default'
                                        className='px-3 py-1 text-xs flex items-center gap-1 cursor-pointer'
                                    >
                                        Add to
                                        <ChevronDown className='h-3 w-3' />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align='end' className='min-w-[160px]'>
                                    {integrations.map((integration) => (
                                        <DropdownMenuItem
                                            key={integration.platform}
                                            onClick={() => addToIntegration(integration.platform, item)}
                                            className='flex items-center gap-2'
                                        >
                                            <div className='w-4 h-4 relative flex-shrink-0'>
                                                <img
                                                    src={integration.logo}
                                                    alt={integration.name}
                                                    className='w-full h-full object-contain'
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'
                                                    }}
                                                />

                                            </div>

                                            <span>
                                                {loading[`${integration.platform}-${item.id}`] ? (
                                                    'Adding...'
                                                ) : (
                                                    `Add to ${integration.name}`
                                                )}
                                            </span>

                                        </DropdownMenuItem>
                                    ))}

                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                    </div>
                )}
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDeleteItem(item.id)}
                    className='opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 text-destructive rounded transition-all cursor-pointer'
                >
                    <Trash2 className='h-4 w-4' />

                </Button>

            </div>

        </div>
    )
}

export default ActionItemRow
