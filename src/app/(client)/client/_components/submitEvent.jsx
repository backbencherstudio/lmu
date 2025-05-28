'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { IoArrowBack } from 'react-icons/io5'
import EventApis from '../../../API/EventApi'

const DateRange = dynamic(
  () => import('react-date-range').then(mod => mod.DateRange),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }
)

// Custom hook to handle window resize
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect is only run on mount

  return windowSize;
}

// Dynamically import the CSS
if (typeof window !== 'undefined') {
  import('react-date-range/dist/styles.css')
  import('react-date-range/dist/theme/default.css')
}

const formatTimeToAMPM = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const formattedHour = hour % 12 || 12
  return `${String(formattedHour).padStart(2, '0')}:${minutes} ${ampm}`
}

export default function SubmitEvent() {
  const router = useRouter();
  const { width } = useWindowSize();
  const defaultDateRange = [{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]

  const defaultTimeRange = {
    startTime: '10:00',
    endTime: '12:00'
  }

  const [dateRange, setDateRange] = React.useState(defaultDateRange)
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      description: '',
    }
  })

  const handleDateRangeChange = (item) => {
    setDateRange([item.selection])
  }

  const handleTimeChange = (type, value) => {
    setTimeRange(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const resetForm = () => {
    reset()
    setDateRange(defaultDateRange)
    setTimeRange(defaultTimeRange)
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const startDate = format(dateRange[0].startDate, 'yyyy-MM-dd')
      const endDate = format(dateRange[0].endDate, 'yyyy-MM-dd')
      const formattedStartTime = formatTimeToAMPM(timeRange.startTime)
      const formattedEndTime = formatTimeToAMPM(timeRange.endTime)
      
      if (new Date(`${endDate}T${timeRange.endTime}`) <= new Date(`${startDate}T${timeRange.startTime}`)) {
        toast.error('End date/time must be after start date/time')
        return
      }

      const eventData = {
        ...data,
        startDate: `${startDate}`,
        endDate: `${endDate}`,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      }

      const response = await EventApis.createEvent(eventData)
      
      if (response.success) {
        resetForm()
        router.push('/') // Redirect to landing page after successful submission
      }
      
    } catch (error) {
      console.error('Error submitting event:', error)
      toast.error(error.message || 'Failed to submit event')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-[#006198] hover:text-[#004d7a] transition-colors"
        >
          <IoArrowBack className="mr-2" />
          <span>Back</span>
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Submit New Event</h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the event details below</p>
          </div>
          <img 
            src="/client/logo.svg" 
            alt="Logo" 
            className="h-14 md:h-18"
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 sm:px-6 py-4">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Event Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Name <span className="text-purple-500">*</span>
            </label>
            <input 
              type="text"
              {...register("name", { 
                required: "Event name is required",
                minLength: {
                  value: 3,
                  message: "Event name must be at least 3 characters"
                }
              })}
              className={`w-full px-3.5 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
              placeholder="Enter event name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-purple-500">*</span>
            </label>
            <input 
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`w-full px-3.5 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-purple-500">*</span>
            </label>
            <input 
              type="tel"
              {...register("phone", { 
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9\-\+\(\)\s\.]{7,15}$/,
                  message: "Phone number must be 7-15 characters long and can contain numbers and symbols"
                }
              })}
              className={`w-full px-3.5 py-2.5 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-blue-500`}
              placeholder="Enter your phone number (e.g. +1 234-567-8901)"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date Range <span className="text-purple-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center mb-4">
              <div className="w-full sm:w-auto flex items-center gap-3">
                <input 
                  type="text"
                  value={format(dateRange[0].startDate, 'MMM dd, yyyy')}
                  className="w-full sm:w-[136px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  readOnly
                />
                <span className="text-gray-500">–</span>
                <input 
                  type="text"
                  value={format(dateRange[0].endDate, 'MMM dd, yyyy')}
                  className="w-full sm:w-[136px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  readOnly
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="mx-auto w-fit rounded-lg border border-gray-200 bg-white p-2 sm:p-4 shadow-lg">
                <DateRange
                  ranges={dateRange}
                  onChange={handleDateRangeChange}
                  months={width < 640 ? 1 : 1}
                  direction="horizontal"
                  className="border-0 !w-full"
                  rangeColors={['#006198']}
                  showDateDisplay={false}
                  showMonthAndYearPickers={true}
                  showPreview={true}
                  moveRangeOnFirstSelection={false}
                  retainEndDateOnFirstSelection={true}
                  minDate={new Date()}
                  maxDate={new Date('2100-12-31')}
                />
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Time Range <span className="text-purple-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-full sm:w-auto flex-1 flex items-center gap-3">
                <input 
                  type="time"
                  value={timeRange.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <span className="text-gray-500">–</span>
                <input 
                  type="time"
                  value={timeRange.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Event Description <span className="text-purple-500">*</span>
            </label>
            <textarea 
              {...register("description", { 
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters"
                }
              })}
              className={`w-full h-32 px-3.5 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg resize-none focus:outline-none focus:border-blue-500`}
              placeholder="Write a short description of the event"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <button 
              type="button"
              className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => {
                resetForm();
                router.push('/');
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-[#006198] rounded-lg hover:bg-[#004d7a] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
