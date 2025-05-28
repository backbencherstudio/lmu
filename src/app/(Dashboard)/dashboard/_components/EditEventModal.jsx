'use client'
import React, { useState, useEffect } from 'react'
import { format, addDays } from 'date-fns'

// Ensure time is in 24-hour format
const ensureTimeFormat = (time) => {
  if (!time) return '00:00';
  // If time includes AM/PM, convert it to 24-hour format
  if (time.includes(' ')) {
    const [timeStr, modifier] = time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  // If already in 24-hour format, return as is
  return time;
};

// Check if event crosses midnight
const doesEventCrossMidnight = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  const [startHours] = startTime.split(':').map(Number);
  const [endHours] = endTime.split(':').map(Number);
  return endHours < startHours;
};

const EditEventModal = ({ isOpen, onClose, onConfirm, event }) => {
  if (!isOpen || !event) return null;

  const [formData, setFormData] = useState({
    name: event.name,
    description: event.description,
    startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
    endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
    startTime: ensureTimeFormat(event.startTime),
    endTime: ensureTimeFormat(event.endTime)
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
    onConfirm(formData);
  };

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
                  value={formData.startTime}
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
                  value={formData.endTime}
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