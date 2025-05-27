'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { EventApis } from '@/services/eventApis';

interface EventData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

// Utility function to convert 12-hour time to 24-hour time
const convert12to24 = (time12h: string): string => {
  try {
    if (!time12h) return '00:00';
    
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    let hoursNum = parseInt(hours, 10);
    
    if (modifier === 'PM' && hoursNum < 12) {
      hoursNum += 12;
    } else if (modifier === 'AM' && hoursNum === 12) {
      hoursNum = 0;
    }
    
    return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
  } catch (error) {
    console.error('Error converting time format:', error);
    return '00:00';
  }
};

// Utility function to convert 24-hour time to 12-hour time
const convert24to12 = (time24h: string): string => {
  try {
    if (!time24h) return '12:00 AM';
    
    let [hours, minutes] = time24h.split(':');
    let hoursNum = parseInt(hours, 10);
    
    const period = hoursNum >= 12 ? 'PM' : 'AM';
    hoursNum = hoursNum % 12 || 12;
    
    return `${hoursNum}:${minutes} ${period}`;
  } catch (error) {
    console.error('Error converting time format:', error);
    return '12:00 AM';
  }
};

// Format date and time with timezone consideration
const formatDateTime = (date: string, time: string, timezone: string = 'America/Cayman'): Date | null => {
  try {
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    
    // Create date in specified timezone
    const dateTime = new Date(Date.UTC(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10)
    ));
    
    if (isNaN(dateTime.getTime())) {
      throw new Error('Invalid date or time');
    }
    
    return dateTime;
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return null;
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Update the form submission handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convert times to 24-hour format for storage
      const start24 = convert12to24(startTime);
      const end24 = convert12to24(endTime);
      
      // Validate the times
      if (!start24 || !end24) {
        toast.error('Invalid time format');
        return;
      }
      
      // Create full date-time objects
      const startDateTime = formatDateTime(startDate, start24);
      const endDateTime = formatDateTime(endDate, end24);
      
      if (!startDateTime || !endDateTime) {
        toast.error('Invalid date or time');
        return;
      }
      
      if (endDateTime <= startDateTime) {
        toast.error('End time must be after start time');
        return;
      }
      
      const eventData: EventData = {
        name: eventName,
        description: description,
        startDate: startDate,
        endDate: endDate,
        startTime: start24,
        endTime: end24,
        timezone: 'America/Cayman' // Store timezone for reference
      };
      
      const response = await EventApis.createEvent(eventData);
      
      if (response.success) {
        toast.success('Event created successfully!');
        router.push('/client/events');
      } else {
        toast.error(response.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 text-white font-medium rounded-md ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
} 