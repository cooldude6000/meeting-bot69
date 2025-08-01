'use client'

import React from 'react'
import { useIntegrations } from './hooks/useIntegrations'
import SetupForm from './components/SetupForm'
import IntegrationCard from './components/IntegrationCard'

function Integrations() {

    const {
        integrations,
        loading,
        setupMode,
        setSetupMode,
        setupData,
        setSetupData,
        setupLoading,
        setSetupLoading,
        fetchIntegrations,
        fetchSetupData,
        handleConnect,
        handleDisconnect,
        handleSetupSubmit
    } = useIntegrations()

    if (loading) {
        return (
            <div className='min-h-screen bg-background flex items-center justify-center p-6'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-foreground mb-4'></div>
                    <div className='text-foreground'>Loading Integrations...</div>
                </div>
            </div>
        )
    }
    return (
        <div className='min-h-screen bg-background p-6'>
            <div className='max-w-4xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-2xl font-bold text-foreground mb-2'>Integrations</h1>

                    <p className='text-muted-foreground'>
                        Connect your favourite tools to automatically add action items from meetings

                    </p>
                </div>

                {setupMode && (
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                        <div className='bg-card rounded-lg p-6 border border-border max-w-md w-full mx-4'>
                            <h2 className='text-lg font-semibold text-foreground mb-4'>
                                Setup {setupMode.charAt(0).toUpperCase() + setupMode.slice(1)}
                            </h2>

                            <SetupForm
                                platform={setupMode}
                                data={setupData}
                                onSubmit={handleSetupSubmit}
                                onCancel={() => {
                                    setSetupMode(null)
                                    setSetupData(null)
                                    window.history.replaceState({}, '', '/integrations')
                                }}
                                loading={setupLoading}
                            />

                        </div>

                    </div>
                )}

                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {integrations.map((integration) => (
                        <IntegrationCard
                            key={integration.platform}
                            integration={integration}
                            onConnect={handleConnect}
                            onDisconnect={handleDisconnect}
                            onSetup={(platform) => {
                                setSetupMode(platform)
                                fetchSetupData(platform)
                            }}
                        />
                    ))}
                </div>

                <div className='mt-8 bg-card rounded-lg p-6 border border-border'>
                    <h3 className='font-semibold text-foreground mb-2'>How it wokrs </h3>

                    <ol className='text-sm text-muted-foreground space-y-2'>
                        <li>1. Connect your preffered tools above</li>
                        <li>2. Choose where to send action items during setup</li>
                        <li>3. In meetings, hover over action items and click "Add to"</li>
                        <li>4. Select which tool(s) to add the task to from the dropdown</li>

                    </ol>

                </div>

            </div>
        </div>
    )
}

export default Integrations
