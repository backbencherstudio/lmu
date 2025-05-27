'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  originalStartDate: string;
  originalEndDate: string;
  originalStartTime: string;
  originalEndTime: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userTimezone, setUserTimezone] = useState<string>('');
  
  useEffect(() => {
    // Get user's timezone
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    fetchEvents();
  }, []);
  
  const formatEventTime = (date: string, time: string): string => {
    try {
      // Create date without timezone offset
      const [hours, minutes] = time.split(':');
      return `${parseInt(hours) % 12 || 12}:${minutes} ${parseInt(hours) >= 12 ? 'PM' : 'AM'}`;
    } catch (error) {
      console.error('Error formatting event time:', error);
      return time;
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setEvents(data.data.map((event: {
          id: string;
          name: string;
          description: string;
          startDate: string;
          endDate: string;
          startTime: string;
          endTime: string;
        }) => ({
          ...event,
          // Store original values
          originalStartDate: event.startDate,
          originalEndDate: event.endDate,
          originalStartTime: event.startTime,
          originalEndTime: event.endTime
        })));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  
  const renderEvent = (event: Event) => {
    const startTime = formatEventTime(event.startDate, event.startTime);
    const endTime = formatEventTime(event.endDate, event.endTime);
    
    return (
      <div key={event.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="text-sm text-gray-500">
          <p>
            {format(new Date(event.startDate + 'T12:00:00'), 'MMMM d, yyyy')}
            <br />
            {startTime} - {endTime}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Events</h1>
      <div className="grid gap-4">
        {events.map(renderEvent)}
      </div>
    </div>
  );
} 