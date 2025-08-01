import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export interface ActionItem {
    id: number
    text: string
}

export interface Integration {
    platform: string
    connected: boolean
    name: string
    logo: string
}

export function useActionItems(meetingId: string) {
    const { userId } = useAuth()

    const [integrations, setIntegrations] = useState<Integration[]>([])
    const [integrationsLoaded, setIntegrationsLoaded] = useState(false)
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
    const [showAddInput, setShowAddInput] = useState(false)
    const [newItemText, setNewItemText] = useState('')

    useEffect(() => {
        if (userId) {
            fetchIntegrations()
        } else {
            setIntegrationsLoaded(true)
        }
    }, [userId])

    const fetchIntegrations = async () => {
        try {
            const response = await fetch('/api/integrations/status')
            const data = await response.json()
            const integrationsWithLogos = data
                .filter((d: any) => d.connected)
                .filter((d: any) => d.platform !== 'slack')
                .map((integration: any) => ({
                    ...integration,
                    logo: `/${integration.platform}.png`
                }))
            setIntegrations(integrationsWithLogos)
        } catch {
            setIntegrations([])
        } finally {
            setIntegrationsLoaded(true)
        }
    }

    return {
        integrations,
        integrationsLoaded,
        loading,
        setLoading,
        showAddInput,
        setShowAddInput,
        newItemText,
        setNewItemText
    }
}