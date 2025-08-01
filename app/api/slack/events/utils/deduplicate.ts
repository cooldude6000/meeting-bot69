declare global {
    var processedEvents: Set<string> | undefined
}

export function isDuplicateEvent(eventId: string, eventTs: string) {
    const uniqueId = `${eventId}-${eventTs}`

    if (!global.processedEvents) {
        global.processedEvents = new Set()
    }

    if (global.processedEvents.has(uniqueId)) {
        return true
    }

    global.processedEvents.add(uniqueId)

    setTimeout(() => {
        global.processedEvents?.delete(uniqueId)
    }, 300000)

    return false
}