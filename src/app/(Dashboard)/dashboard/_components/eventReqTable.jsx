'use client'
import React, { useState, useMemo } from 'react'
import { FaTrash } from 'react-icons/fa'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { subDays, parseISO, isWithinInterval } from 'date-fns'
import { dummyData } from './dummyData'

export default function EventReqTable() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')
  const [timeFilter, setTimeFilter] = useState('30days')
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '15days', label: 'Last 15 days' },
    { value: '30days', label: 'Last 30 days' },
  ]

  const getFilteredDateRange = (days) => {
    const today = new Date()
    const startDate = subDays(today, days)
    return { startDate, endDate: today }
  }

  const filteredData = useMemo(() => {
    // First filter by status
    let filtered = dummyData.filter(item => {
      if (activeTab === 'all') return true
      if (activeTab === 'approved') return item.status === 'completed'
      if (activeTab === 'pending') return item.status === 'pending'
      if (activeTab === 'rejected') return item.status === 'cancelled'
      return true
    })

    // Then filter by date range
    const days = parseInt(timeFilter.replace('days', ''))
    const { startDate, endDate } = getFilteredDateRange(days)

    return filtered.filter(item => {
      const submittedDate = parseISO(item.submittedDate)
      return isWithinInterval(submittedDate, { start: startDate, end: endDate })
    })
  }, [activeTab, timeFilter])

  const handleDateRangeChange = (value) => {
    setTimeFilter(value)
    setShowDateDropdown(false)
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#386641] text-white'
      case 'cancelled':
        return 'bg-[#e63946] text-white'
      default:
        return 'bg-[#e67e22] text-white'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Pending'
    }
  }

  const handleViewDetails = (eventId) => {
    router.push(`/dashboard/event-request/${eventId}`)
  }

  const truncateDescription = (description) => {
    const words = description.split(' ')
    if (words.length > 7) {
      return words.slice(0, 7).join(' ') + '...'
    }
    return description
  }

  return (
    <div className="w-full inline-flex flex-col justify-start items-start gap-6">
      <div className="w-full inline-flex justify-start items-center gap-4">
        <div className="flex-1 flex justify-start items-center">
          <div 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 border-b-2 flex justify-center items-center gap-2.5 cursor-pointer
              ${activeTab === 'all' ? 'border-[#d6ae29] text-[#070707]' : 'border-[#f3f3f4] text-[#777980]'}`}
          >
            <div className="text-base font-normal font-['Inter'] leading-none">All history</div>
          </div>
          <div 
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 border-b flex justify-center items-center gap-2.5 cursor-pointer
              ${activeTab === 'approved' ? 'border-[#d6ae29] text-[#070707]' : 'border-[#f3f3f4] text-[#777980]'}`}
          >
            <div className="text-base font-normal font-['Inter'] leading-none">Approved</div>
          </div>
          <div 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 border-b flex justify-center items-center gap-2.5 cursor-pointer
              ${activeTab === 'pending' ? 'border-[#d6ae29] text-[#070707]' : 'border-[#f3f3f4] text-[#777980]'}`}
          >
            <div className="text-base font-normal font-['Inter'] leading-none">Pending</div>
          </div>
          <div 
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 border-b flex justify-center items-center gap-2.5 cursor-pointer
              ${activeTab === 'rejected' ? 'border-[#d6ae29] text-[#070707]' : 'border-[#f3f3f4] text-[#777980]'}`}
          >
            <div className="text-base font-normal font-['Inter'] leading-none">Rejected</div>
          </div>
        </div>
        <div className="relative w-[140px]">
          <button 
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="w-full px-3 py-1.5 rounded outline-1 outline-[#0068ef] flex items-center justify-between"
          >
            <span className="text-[#0068ef] text-sm font-bold">
              {dateRangeOptions.find(opt => opt.value === timeFilter)?.label}
            </span>
            <MdKeyboardArrowDown className="text-[#0068ef] w-5 h-5" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 z-10">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDateRangeChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                    ${timeFilter === option.value ? 'font-bold text-[#0068ef]' : 'text-gray-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-4 py-4 text-left text-sm text-[#4a4c56] font-bold">Date</th>
              <th className="px-4 py-4 text-left text-sm text-[#4a4c56] font-bold">Event Name</th>
              <th className="px-4 py-4 text-left text-sm text-[#4a4c56] font-bold">Description</th>
              <th className="px-4 py-4 text-left text-sm text-[#4a4c56] font-bold">Phone Number</th>
              <th className="px-4 py-4 text-left text-sm text-[#4a4c56] font-bold">Status</th>
              <th className="px-4 py-4 text-left text-sm text-[#4a4c56] font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((event) => (
              <tr key={event.id} className="border-b border-[#eaecf0]">
                <td className="px-4 py-4 text-sm font-bold text-[#777980]">{event.submittedDate}</td>
                <td className="px-4 py-4 text-sm font-bold text-[#070707]">{event.name}</td>
                <td className="px-4 py-4 text-sm font-bold text-[#777980]">{truncateDescription(event.description)}</td>
                <td className="px-4 py-4 text-sm font-bold text-[#777980]">{event.phone || 'N/A'}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    <div className={`inline-flex items-center justify-center w-24 px-2 py-1 rounded ${getStatusStyle(event.status)}`}>
                      <span className="text-sm font-bold">{getStatusText(event.status)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewDetails(event.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm font-bold"
                    >
                      Details
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-md hover:bg-red-200">
                      <FaTrash className="text-red-600" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
