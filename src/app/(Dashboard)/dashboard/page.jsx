'use client'
import React, { useState, useEffect } from 'react'
import { DateRange } from 'react-date-range'
import { format } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import EventApis from '../../API/EventApi'
import { toast } from 'react-hot-toast'
import { MdDelete, MdEdit, MdDownload } from 'react-icons/md'
import * as XLSX from 'xlsx'
import DeleteConfirmationModal from './_components/DeleteConfirmationModal'
import EditEventModal from './_components/EditEventModal'

export default function Dashboard() {
  const defaultFormState = {
    name: '',
    dateRange: [{
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }],
    timeRange: {
      startTime: '10:00',
      endTime: '12:00'
    },
    description: ''
  }

  // Form states
  const [name, setName] = useState(defaultFormState.name)
  const [dateRange, setDateRange] = useState(defaultFormState.dateRange)
  const [timeRange, setTimeRange] = useState(defaultFormState.timeRange)
  const [description, setDescription] = useState(defaultFormState.description)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
    eventName: ''
  })
  const [editModal, setEditModal] = useState({
    isOpen: false,
    event: null
  })

  const validateForm = () => {
    const newErrors = {}
    
    if (!name.trim()) {
      newErrors.name = 'Event name is required'
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!timeRange.startTime || !timeRange.endTime) {
      newErrors.time = 'Both start and end time are required'
    }

    // Additional validation for dates
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      newErrors.date = 'Both start and end dates are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDateRangeChange = (item) => {
    setDateRange([item.selection])
  }

  const handleTimeChange = (type, value) => {
    setTimeRange(prev => ({
      ...prev,
      [type]: value
    }))
    if (errors.time) {
      setErrors(prev => ({ ...prev, time: '' }))
    }
  }

  const resetForm = () => {
    setName(defaultFormState.name)
    setDateRange(defaultFormState.dateRange)
    setTimeRange(defaultFormState.timeRange)
    setDescription(defaultFormState.description)
    setErrors({})
  }

  const handleSave = async () => {
    if (validateForm()) {
      setIsLoading(true)
      try {
        // Get the dates in YYYY-MM-DD format
        const startDate = format(dateRange[0].startDate, 'yyyy-MM-dd');
        const endDate = format(dateRange[0].endDate, 'yyyy-MM-dd');
        
        // Get times in HH:mm format
        const startTime = timeRange.startTime;
        const endTime = timeRange.endTime;

        // Create date objects for comparison
        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        
        if (end <= start) {
          toast.error('End date/time must be after start date/time');
          setIsLoading(false);
          return;
        }

        const eventData = {
          name: name.trim(),
          startDate,
          endDate,
          startTime,
          endTime,
          description: description.trim()
        };

        console.log('Sending event data:', eventData);
        
        const response = await EventApis.createEvent(eventData);
        console.log('API Response:', response);
        
        if (response.success) {
          await fetchEvents(); // Refresh the events list
          resetForm();
          toast.success('Event created successfully');
        } else {
          throw new Error(response.message || 'Failed to create event');
        }
      } catch (error) {
        console.error('Error creating event:', error);
        toast.error(error.message || 'Failed to create event');
      } finally {
        setIsLoading(false);
      }
    }
  }

  const fetchEvents = async () => {
    const response = await EventApis.getAllEvents({
      limit: 1000 // Set a high limit to get all events
    })
    if (response.success) {
      // Process dates properly before setting in state
      const processedEvents = response.data.map(event => ({
        ...event,
        // Store original date strings
        startDate: event.startDate.split('T')[0],
        endDate: event.endDate.split('T')[0],
        // Ensure time is in 24h format
        startTime: event.startTime,
        endTime: event.endTime
      }));
      setEvents(processedEvents);
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleDeleteClick = (event) => {
    setDeleteModal({
      isOpen: true,
      eventId: event.id,
      eventName: event.name
    })
  }

  const handleDeleteConfirm = async () => {
    if (deleteModal.eventId) {
      setIsDeleting(true)
      try {
        const response = await EventApis.deleteEvent(deleteModal.eventId)
        if (response.success) {
          await fetchEvents() // Refresh the events list
        }
      } finally {
        setIsDeleting(false)
        setDeleteModal({ isOpen: false, eventId: null, eventName: '' })
      }
    }
  }

  const handleEditClick = (event) => {
    setEditModal({
      isOpen: true,
      event: event
    })
  }

  const handleEditConfirm = async (updatedData) => {
    try {
      const response = await EventApis.updateEvent(editModal.event.id, updatedData)
      if (response.success) {
        await fetchEvents() // Refresh the events list
        setEditModal({ isOpen: false, event: null })
      }
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update event')
    }
  }

  // Handle download function
  const handleDownload = () => {
    try {
      // Prepare data for Excel
      const excelData = events.map(event => ({
        'Event Name': event.name,
        'Description': event.description,
        'Start Date': format(new Date(event.startDate), 'MMM dd, yyyy'),
        'End Date': format(new Date(event.endDate), 'MMM dd, yyyy'),
        'Start Time': event.startTime,
        'End Time': event.endTime
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Events");

      // Generate Excel file
      XLSX.writeFile(wb, `events_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      toast.error('Failed to download Excel file');
    }
  };

  return (
    <div className="p-8 pb-12 bg-white">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Create Event</h1>
          
          {/* Search Bar */}

        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6">
        {/* Event Info Header */}
        <div className="flex justify-between items-center pb-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Event info</h2>
            <p className="text-sm text-gray-600">Update your event details here.</p>
          </div>
        </div>

        {/* Event Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Event Name */}
          <div className="flex gap-8">
            <label className="w-[280px] text-sm font-semibold text-gray-700">
              Event Name
              <span className="text-purple-500">*</span>
            </label>
            <div className="flex-1 max-w-[512px]">
              <input 
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: '' }))
                  }
                }}
                className={`w-full px-3.5 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex gap-8 py-6">
            <label className="w-[280px] text-sm font-semibold text-gray-700">
              Date
            </label>
            <div className="flex-1 max-w-[512px]">
              <div>
                <div className="flex gap-3 items-center mb-4">
                  <input 
                    type="text"
                    value={format(dateRange[0].startDate, 'MMM dd, yyyy')}
                    className="w-[136px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    readOnly
                  />
                  <span className="text-gray-500">–</span>
                  <input 
                    type="text"
                    value={format(dateRange[0].endDate, 'MMM dd, yyyy')}
                    className="w-[136px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    readOnly
                  />
                </div>
                <div className="h-full w-[366px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                  <DateRange
                    ranges={[{
                      startDate: dateRange[0].startDate,
                      endDate: dateRange[0].endDate,
                      key: 'selection'
                    }]}
                    onChange={handleDateRangeChange}
                    months={1}
                    direction="vertical"
                    className="border-0"
                    rangeColors={['#006198']}
                    showDateDisplay={false}
                    showMonthAndYearPickers={true}
                    showPreview={true}
                    moveRangeOnFirstSelection={false}
                    retainEndDateOnFirstSelection={true}
                    minDate={new Date('1900-01-01')}
                    maxDate={new Date('2100-12-31')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="flex gap-8">
            <label className="w-[280px] text-sm font-semibold text-gray-700 flex items-center gap-1">
              Time
              <span className="text-purple-500">*</span>
              <button className="w-4 h-4 text-gray-400 hover:text-gray-600" title="Select time range">
                ?
              </button>
            </label>
            <div className="flex-1 max-w-[512px]">
              <div className="flex gap-3 items-center">
                <input 
                  type="time"
                  value={timeRange.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className={`w-[136px] px-3 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                />
                <span className="text-gray-500">–</span>
                <input 
                  type="time"
                  value={timeRange.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className={`w-[136px] px-3 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
                />
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-500">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Event Description */}
          <div className="flex gap-8">
            <div className="w-[280px]">
              <label className="text-sm font-semibold text-gray-700">
                Event Description
                <span className="text-purple-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">Write a short introduction.</p>
            </div>
            <div className="flex-1 max-w-[512px]">
              <textarea 
                className={`w-full h-[154px] px-3.5 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg resize-none focus:outline-none focus:border-blue-500`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: '' }))
                  }
                }}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
        </form>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button 
            className="px-3.5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={resetForm}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="px-3.5 py-2.5 text-sm font-semibold text-white bg-[#006198] rounded-lg hover:bg-[#004d7a] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </main>

      {/* Events Table */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">All Events</h2>
            <span className="text-sm text-gray-600">({events.length})</span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdDownload className="w-5 h-5" />
            <span>Download Excel</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.name.split(' ').slice(0, 6).join(' ')}
                    {event.name.split(' ').length > 6 ? '...' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.description.includes('http') 
                      ? event.description.length > 45 
                        ? event.description.substring(0, 45) + '...'
                        : event.description
                      : event.description.split(' ').slice(0, 7).join(' ') + 
                        (event.description.split(' ').length > 7 ? '...' : '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(event.startDate + 'T00:00:00'), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(event.endDate + 'T00:00:00'), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-colors duration-200 rounded hover:bg-blue-50"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        disabled={isDeleting}
                        className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors duration-200 rounded hover:bg-red-50"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, eventId: null, eventName: '' })}
        onConfirm={handleDeleteConfirm}
        eventName={deleteModal.eventName}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, event: null })}
        onConfirm={handleEditConfirm}
        event={editModal.event}
      />
    </div>
  )
}
