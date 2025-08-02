import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export interface Integration {
    platform: 'google-calendar' | 'trello' | 'jira' | 'asana' | 'slack'
    name: string
    description: string
    connected: boolean
    boardName?: string
    projectName?: string
    channelName?: string
    logo: string
}

export function useIntegrations() {
    const { userId } = useAuth()

    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            platform: 'slack',
            name: 'Slack',
            description: 'Post meeting summaries to your Slack channels',
            connected: false,
            channelName: undefined,
            logo: '/slack.png'
        },
        {
            platform: 'trello',
            name: 'Trello',
            description: 'Add action items to your Trello boards',
            connected: false,
            logo: '/trello.png'
        },
        {
            platform: 'jira',
            name: 'Jira',
            description: 'Create tickets for development tasks and more',
            connected: false,
            logo: '/jira.png'
        }, {
            platform: 'asana',
            name: 'Asana',
            description: 'Sync tasks with your team projects',
            connected: false,
            logo: '/asana.png'
        },
        {
            platform: 'google-calendar',
            name: 'Google Calendar',
            description: 'Auto-Sync meetings',
            connected: false,
            logo: '/gcal.png'
        }
    ])

    const [loading, setLoading] = useState(true)
    const [setupMode, setSetupMode] = useState<string | null>(null)
    const [setupData, setSetupData] = useState<any>(null)
    const [setupLoading, setSetupLoading] = useState(false)

    useEffect(() => {
        if (userId) {
            fetchIntegrations()
        }

        const urlParams = new URLSearchParams(window.location.search)
        const setup = urlParams.get('setup')
        if (setup && ['trello', 'jira', 'asana', 'slack'].includes(setup)) {
            setSetupMode(setup)
            fetchSetupData(setup)
        }
    }, [userId])


    const fetchIntegrations = async () => {
        try {
            const response = await fetch('/api/integrations/status')
            const data = await response.json()

            const calendarResponse = await fetch('/api/user/calendar-status')
            const calendarData = await calendarResponse.json()

            setIntegrations(prev => prev.map(integration => {
                if (integration.platform === 'google-calendar') {
                    return {
                        ...integration,
                        connected: calendarData.connected || false
                    }
                }

                const status = data.find((d: any) => d.platform === integration.platform)
                return {
                    ...integration,
                    connected: status?.connected || false,
                    boardName: status?.boardName,
                    projectName: status?.projectName,
                    channelName: status?.channelName
                }
            }))
        } catch (error) {
            console.error('error fetching integrations:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSetupData = async (platform: string) => {
        try {
            const response = await fetch(`/api/integrations/${platform}/setup`)
            const data = await response.json()
            setSetupData(data)
        } catch (error) {
            console.error(`Error fetching ${platform} setup data:`, error)
        }
    }

    const handleConnect = (platform: string) => {
        if (platform === 'slack') {
            window.location.href = '/api/slack/install?return=integrations'
        } else if (platform === 'google-calendar') {
            window.location.href = '/api/auth/google/direct-connect'
        } else {
            window.location.href = `/api/integrations/${platform}/auth`
        }
    }

    const handleDisconnect = async (platform: string) => {
        try {
            if (platform === 'google-calendar') {
                await fetch('/api/auth/google/disconnect', {
                    method: 'POST'
                }
                )
            } else {
                await fetch(`/api/integrations/${platform}/disconnect`, {
                    method: 'POST'
                })
            }
            fetchIntegrations()
        } catch (error) {
            console.error('error disconnecting:', error)
        }
    }

    const handleSetupSubmit = async (platform: string, config: any) => {
        setSetupLoading(true)
        try {
            const response = await fetch(`/api/integrations/${platform}/setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            })
            if (response.ok) {
                setSetupMode(null)
                setSetupData(null)

                fetchIntegrations()
                window.history.replaceState({}, '', '/integrations')
            }
        } catch (error) {
            console.error('error saving setup:', error)
        } finally {
            setSetupLoading(false)
        }
    }

    return {
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
    }
}