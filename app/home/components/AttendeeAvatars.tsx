import React from 'react'
interface AttendeeAvatarsProps {
  attendees: any
  getAttendeeList: (attendees: any) => string[]
  getInitials: (name: string) => string
}



function AttendeeAvatars({ attendees, getAttendeeList, getInitials }: AttendeeAvatarsProps) {
  const attendeeList = getAttendeeList(attendees)
  return (
    <div className='flex -space-x-2'>
      {attendeeList.slice(0, 4).map((attendee, index) => (
        <div
          key={index}
          className='relative group'
          title={attendee}
        >
          <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-background flex items-center justify-center text-white text-xs font-medium hover:scale-110 transition-transform cursor-pointer'>
            {getInitials(attendee)}
          </div>
          <div className='absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10'>
            {attendee}
          </div>
        </div>
      ))}
      {attendeeList.length > 4 && (
        <div
          className='w-6 h-6 rounded-full bg-gray-500 border-2 border-background flex items-center justify-center text-white text-xs font-medium'
          title={`+${attendeeList.length - 4} more`}

        >
          +{attendeeList.length - 4}
        </div>
      )}

    </div>
  )
}

export default AttendeeAvatars
