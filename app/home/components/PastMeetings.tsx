import React from 'react'
import { PastMeeting } from '../hooks/useMeetings'
import { Clock, ExternalLink, Video } from 'lucide-react'
import AttendeeAvatars from './AttendeeAvatars'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface PastMeetingsProps {
    pastMeetings: PastMeeting[]
    pastLoading: boolean
    onMeetingClick: (id: string) => void
    getAttendeeList: (attendees: any) => string[]
    getInitials: (name: string) => string
}

function PastMeetings({
    pastMeetings,
    pastLoading,
    onMeetingClick,
    getAttendeeList,
    getInitials
}: PastMeetingsProps) {

    if (pastLoading) {
        return (
            <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                    <div key={i} className='bg-card rounded-lg p-4 border border-border animate-pulse'>
                        <div className='flex justify-between items-start mb-3'>
                            <div className='flex items-center gap-3 flex-1'>
                                <div className='h-6 bg-muted rounded w-48'></div>
                                <div className='flex -space-x-2'>

                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className='w-6 h-6 rounded-full bg-muted'></div>
                                    ))}
                                </div>

                            </div>
                            <div className='h-5 bg-muted rounded w-20'></div>
                        </div>

                        <div className='h-4 bg-muted rounded w-3/4 mb-3'></div>
                        <div className='h-4 bg-muted rounded w-1/2 mb-3'></div>
                        <div className='h-6 bg-muted rounded w-24'></div>

                    </div>
                ))}

            </div>
        )
    }

    if (pastMeetings.length === 0) {
        return (
            <div className='bg-card rounded-lg p-8 text-center border border-border'>
                <Video className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium mb-2 text-foreground'>No past meetings</h3>
                <p className='text-muted-foreground'>Your completed meetings will appear here</p>
            </div>
        )
    }

    return (
        <div className='space-y-4'>
            {pastMeetings.map((meeting) => (
                <div
                    key={meeting.id}
                    className='bg-card rounded-lg p-4 border border-border hover:shadow-md transition-shadow cursor-pointer'
                    onClick={() => onMeetingClick(meeting.id)}
                >
                    <div className='flex justify-between items-start mb-3'>
                        <div className='flex items-center gap-3 flex-1'>
                            <h3 className='font-semibold text-lg text-foreground'>
                                {meeting.title}
                            </h3>
                            {meeting.attendees && (
                                <AttendeeAvatars
                                    attendees={meeting.attendees}
                                    getAttendeeList={getAttendeeList}
                                    getInitials={getInitials}
                                />
                            )}
                        </div>
                        <span className='text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full'>
                            Completed
                        </span>
                    </div>
                    {meeting.description && (
                        <p className='text-sm text-muted-foreground mb-3'>{meeting.description}</p>
                    )}

                    <div className='text-sm text-muted-foreground mb-3'>
                        <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4' />
                            <span>
                                {format(new Date(meeting.startTime), 'PPp')} - {format(new Date(meeting.endTime), 'pp')}
                            </span>
                        </div>
                    </div>

                    <div
                        className='flex gap-2 mt-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            className='flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors h-6 cursor-pointer'
                            onClick={() => onMeetingClick(meeting.id)}
                        >
                            <ExternalLink className='h-3 w-3' />
                            View Details
                        </Button>

                    </div>

                </div>
            ))}

        </div>
    )
}

export default PastMeetings
