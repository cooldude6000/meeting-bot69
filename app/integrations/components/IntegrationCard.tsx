import React from 'react'
import { Integration } from '../hooks/useIntegrations'
import Image from 'next/image'
import { Check, ExternalLink, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IntegrationCardProps {
    integration: Integration
    onConnect: (platform: string) => void
    onDisconnect: (platform: string) => void
    onSetup: (platform: string) => void
}


function IntegrationCard({
    integration,
    onConnect,
    onDisconnect,
    onSetup
}: IntegrationCardProps) {
    return (
        <div className='bg-card rounded-lg p-6 border border-border'>
            <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 relative flex-shrink-0'>
                        <Image
                            src={integration.logo}
                            alt={`${integration.name} logo`}
                            fill
                            className='object-contain rounded'
                        />

                    </div>
                    <div>
                        <h3 className='font-semibold text-foreground'>{integration.name}</h3>

                        {integration.connected && (
                            <span className='text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full'>
                                Connected
                            </span>
                        )}
                    </div>

                </div>
                {integration.connected && (
                    <Check className='h-5 w-5 text-green-500' />
                )}
            </div>
            <p className='text-sm text-muted-foreground mb-4'>
                {integration.description}
            </p>

            {integration.connected && integration.platform !== 'google-calendar' && (integration.boardName || integration.projectName || integration.channelName) && (
                <div className='mb-4 p-3 bg-muted/50 rounded-lg'>
                    <div className='text-xs text-muted-foreground mb-1'>Destination:</div>
                    <div className='text-sm font-medium text-foreground' >
                        {integration.platform === 'slack' && integration.channelName && `#${integration.channelName}`}
                        {integration.platform === 'trello' && integration.boardName}
                        {integration.platform === 'jira' && integration.projectName}
                        {integration.platform === 'asana' && integration.projectName}
                    </div>
                </div>
            )}

            {integration.connected && integration.platform === 'google-calendar' && (
                <div className='mb-4 p-3 bg-muted/50 rounded-lg'>
                    <div className='text-xs text-muted-foreground mb-1'>Status:</div>
                    <div className='text-sm font-medium text-foreground'>
                        Lambda auto-sync anabled
                    </div>
                </div>
            )}

            <div className='flex gap-2'>
                {integration.connected ? (
                    integration.platform === 'google-calendar' ? (
                        <Button
                            variant="outline"
                            onClick={() => onDisconnect(integration.platform)}
                            className='flex-1 cursor-pointer'
                            type='button'
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onDisconnect(integration.platform)}
                                className='flex-1 cursor-pointer'
                                type='button'
                            >
                                Disconnect
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onSetup(integration.platform)}
                                className='px-3 py-2 cursor-pointer'
                                type='button'
                            >
                                <Settings className='h-4 w-4' />
                            </Button>
                        </>
                    )
                ) : (
                    <Button
                        onClick={() => onConnect(integration.platform)}
                        className='flex-1 flex items-center justify-center gap-2 cursor-pointer'
                        type='button'
                    >
                        Connect
                        <ExternalLink className='h-4 w-4' />
                    </Button>
                )}

            </div>

        </div>
    )
}

export default IntegrationCard
