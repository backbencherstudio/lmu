'use client'
import React, { useState, useEffect } from 'react'
import { format, addDays, parse } from 'date-fns'

// Convert 12-hour time (e.g. "11:00 PM") to 24-hour format (e.g. "23:00")
const convertTo24Hour = (time12h) => {
  if (!time12h) return '00:00';
  // If already in 24-hour format (e.g. "23:00"), return as is
  if (!time12h.includes(' ')) return time12h;

  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Convert 24-hour time (e.g. "23:00") to 12-hour format (e.g. "11:00 PM")
const convertTo12Hour = (time24h) => {
  if (!time24h) return '';
  // If already in 12-hour format (contains AM/PM), return as is
  if (time24h.includes(' ')) return time24h;
  
  let [hours, minutes] = time24h.split(':').map(Number);
  // Swap AM/PM logic
  const period = hours >= 12 ? 'AM' : 'PM';  // Changed PM to AM and AM to PM
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Check if event crosses midnight
const doesEventCrossMidnight = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  const start24 = convertTo24Hour(startTime);
  const end24 = convertTo24Hour(endTime);
  const [startHours] = start24.split(':').map(Number);
  const [endHours] = end24.split(':').map(Number);
  return endHours < startHours;
};

const EditEventModal = ({ isOpen, onClose, onConfirm, event }) => {
  if (!isOpen || !event) return null;

  // Initialize with original event times
  const [formData, setFormData] = useState({
    name: event.name,
    description: event.description,
    startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
    endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
    startTime: event.startTime,  // Keep original time format
    endTime: event.endTime      // Keep original time format
  });

  // Effect to handle date adjustment when time crosses midnight
  useEffect(() => {
    if (doesEventCrossMidnight(formData.startTime, formData.endTime)) {
      const nextDay = format(addDays(new Date(formData.startDate), 1), 'yyyy-MM-dd');
      setFormData(prev => ({
        ...prev,
        endDate: nextDay
      }));
    }
  }, [formData.startTime, formData.endTime, formData.startDate]);

  const handleTimeChange = (field, value) => {
    // For time inputs, convert the 24-hour input value to 12-hour format
    if (field === 'startTime' || field === 'endTime') {
      value = convertTo12Hour(value);
    }
    
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'startTime' || field === 'endTime') {
        if (doesEventCrossMidnight(newData.startTime, newData.endTime)) {
          newData.endDate = format(addDays(new Date(newData.startDate), 1), 'yyyy-MM-dd');
        } else {
          newData.endDate = newData.startDate;
        }
      }
      
      if (field === 'startDate') {
        if (doesEventCrossMidnight(newData.startTime, newData.endTime)) {
          newData.endDate = format(addDays(new Date(value), 1), 'yyyy-MM-dd');
        } else {
          newData.endDate = value;
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const adjustedData = {
      ...formData,
      startTime: convertTo12Hour(convertTo24Hour(formData.startTime)),
      endTime: convertTo12Hour(convertTo24Hour(formData.endTime))
    };
    onConfirm(adjustedData);
  };

  // Convert times to 24-hour format for input elements
  const startTime24 = convertTo24Hour(formData.startTime);
  const endTime24 = convertTo24Hour(formData.endTime);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg w-full max-w-[600px] shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit Event
          </h3>
          {/* Display original times for reference */}
          <p className="text-sm text-gray-500 mt-1">
            Original times: {event.startTime} - {event.endTime}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleTimeChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
                {doesEventCrossMidnight(formData.startTime, formData.endTime) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Event ends next day
                  </p>
                )}
              </div>
            </div>

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime24}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime24}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;