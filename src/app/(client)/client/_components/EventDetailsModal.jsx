'use client'
import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, isValid, parseISO } from 'date-fns';

const EventDetailsModal = ({ isOpen, onClose, events = [], date }) => {
  // Safely parse the date
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      const parsedDate = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
      return isValid(parsedDate) ? parsedDate : null;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  // Format time for event
  const formatTime = (time) => {
    const parsed = parseDate(time);
    try {
      return parsed ? format(parsed, 'h:mm a') : 'Invalid time';
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  // Format date for modal title
  const formatDate = (dateStr) => {
    const parsed = parseDate(dateStr);
    try {
      return parsed ? format(parsed, 'EEEE, MMMM d, yyyy') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Convert URLs in text to clickable links
  const convertLinksToClickable = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Events for {date ? formatDate(date) : 'Selected Date'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <div key={event.id || index} className="bg-white rounded-lg border shadow-sm">
                {/* Event Name */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-t-lg">
                  <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                </div>
                {/* Event Time */}
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time</p>
                      <p className="text-gray-900">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Description */}
                {event.description && (
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-medium text-gray-900">Description</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {convertLinksToClickable(event.description)}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No events scheduled for this date
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal; 