'use client'

import { useUser } from '@clerk/nextjs'
import React from 'react'

interface MeetingData {
    title: string
    date: string
    time: string
    userName: string
}

interface MeetingInfoProps {
    meetingData: MeetingData
}

function MeetingInfo({ meetingData }: MeetingInfoProps) {
    const { user } = useUser()
    return (
        <div className='mb-8'>
            <h2 className='text-3xl font-bold text-foreground mb-3'>
                {meetingData.title}
            </h2>

            <div className='text-sm text-muted-foreground mb-8 flex items-center gap-4 flex-wrap'>
                <span className='flex items-center gap-2'>
                    <div className='w-5 h-5 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-border'>
                        {user?.imageUrl ? (
                            <img
                                src={user.imageUrl}
                                alt={`${meetingData.userName}'s profile`}
                                className="w-5 h-5 rounded-full object-cover"
                            />
                        ) : (
                            <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                                <span className='text-xs text-primary font-medium'>
                                    {meetingData.userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    {meetingData.userName}
                </span>
                <span className='flex items-center gap-1'>
                    📅 {meetingData.date}
                </span>

                <span className='flex items-center gap-1'>
                    🕐 {meetingData.time}
                </span>
            </div>
        </div>
    )
}

export default MeetingInfo
