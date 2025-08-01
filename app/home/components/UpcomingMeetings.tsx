import React from 'react'
import { CalendarEvent } from '../hooks/useMeetings'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Clock } from 'lucide-react'
import { format } from 'date-fns'

interface UpcomingMeetingsProps {
    upcomingEvents: CalendarEvent[]
    connected: boolean
    error: string
    loading: boolean
    initialLoading: boolean
    botToggles: { [key: string]: boolean }
    onRefresh: () => void
    onToggleBot: (eventId: string) => void
    onConnectCalendar: () => void
}

function UpcomingMeetings({
    upcomingEvents,
    connected,
    error,
    loading,
    initialLoading,
    botToggles,
    onRefresh,
    onToggleBot,
    onConnectCalendar
}: UpcomingMeetingsProps) {
    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-bold text-foreground'>Upcoming</h2>
                <span className='text-sm text-muted-foreground'>({upcomingEvents.length})</span>
            </div>

            {error && (
                <div className='bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-2xl mb-6 text-sm'>
                    {error}
                </div>
            )}

            {initialLoading ? (
                <div className='bg-card rounded-lg p-6 border border-border'>
                    <div className='animate-pulse'>
                        <div className='w-12 h-12 mx-auto bg-muted rounded-full mb-3'></div>
                        <div className='h-4 bg-muted rounded w-3/4 mx-auto mb-2'></div>
                        <div className='h-3 bg-muted rounded w-1/2 mx-auto mb-4'></div>
                        <div className='h-8 bg-muted rounded w-full'></div>
                    </div>
                </div>
            ) : !connected ? (
                <div className='bg-card rounded-lg p-6 text-center border border-border'>
                    <div className='w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3'>
                        📆
                    </div>
                    <h3 className='font-semibold mb-2 text-foreground text-sm'>Connect Calendar</h3>
                    <p className='text-muted-foreground mb-4 text-xs'>
                        Connect Google Calendar to see upcoming meetings
                    </p>

                    <Button
                        onClick={onConnectCalendar}
                        disabled={loading}
                        className='w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm cursor-pointer'
                    >
                        {loading ? 'Connecting' : 'Connect Google Calendar'}
                    </Button>
                </div>
            ) : upcomingEvents.length === 0 ? (
                <div className='bg-card rounded-lg p-6 text-center border border-border'>
                    <h3 className='font-medium mb-2 text-foreground text-sm'>
                        No upcoming meetings
                    </h3>
                    <p className='text-muted-foreground text-xs '>
                        Your caledar is clear!
                    </p>
                </div>
            ) : (
                <div className='space-y-3'>
                    <Button
                        className='w-full px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 disabled:opacity-50 transition-colors text-foreground text-sm mb-4 cursor-pointer'
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                    {upcomingEvents.map((event) => (
                        <div key={event.id} className='bg-card rounded-lg p-3 border border-border hover:shadow-md transition-shadow relative'>
                            <div className='absolute top-3 right-3'>
                                <Switch
                                    checked={!!botToggles[event.id]}
                                    onCheckedChange={() => onToggleBot(event.id)}
                                    aria-label='Toggle bot for this meeting'
                                    className='cursor-pointer'
                                />
                            </div>
                            <h4 className='font-medium text-sm text-foreground mb-2 pr-12'>{event.summary || 'No Title'}</h4>
                            <div className='space-y-1 text-xs text-muted-foreground'>
                                <div className='flex items-center gap-1'>
                                    <Clock className='w-3 h-3' />
                                    {format(new Date(event.start?.dateTime || event.start?.date || ''), 'MMM d, h:mm a')}
                                </div>
                                {event.attendees && (
                                    <div>👥 {event.attendees.length} attendees</div>
                                )}
                            </div>
                            {(event.hangoutLink || event.location) && (
                                <a
                                    href={event.hangoutLink || event.location || '#'}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <Button className='mt-2 w-full px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors h-6 cursor-pointer'>
                                        Join Meeting
                                    </Button>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UpcomingMeetings
