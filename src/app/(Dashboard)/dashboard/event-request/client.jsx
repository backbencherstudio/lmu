'use client'
import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Download,
  Plus,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { dummyData } from '../_components/dummyData'
import EventRequestTable from '../_components/eventrequesttable'
import EventDetailsModal from '../_components/EventDetailsModal'
import DeleteRequestModal from '../_components/deleterequestmodal'
import { subDays } from 'date-fns'

export default function EventRequestClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [timeFilter, setTimeFilter] = useState("30")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  const handleDelete = (event) => {
    setEventToDelete(event)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    console.log('Deleting event:', eventToDelete.id)
    setIsDeleteModalOpen(false)
    setEventToDelete(null)
  }

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const filteredEvents = useMemo(() => {
    let filtered = dummyData.filter((event) => {
      if (activeTab === "all") return true
      if (activeTab === "approved") return event.status === "completed"
      if (activeTab === "pending") return event.status === "pending"
      if (activeTab === "rejected") return event.status === "cancelled"
      return true
    })

    const days = parseInt(timeFilter)
    const today = new Date()
    const startDate = subDays(today, days)

    return filtered.filter((event) => {
      const eventDate = new Date(event.submittedDate)
      return eventDate >= startDate && eventDate <= today
    })
  }, [activeTab, timeFilter])

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6  min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Event Management Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive event tracking and analytics</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
          <Button variant="outline" className="shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-5">
          <EventRequestTable 
            events={filteredEvents}
            onViewDetails={handleViewDetails}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-sm text-gray-600 px-2">
        <span>
          Showing {filteredEvents.length} of {dummyData.length} events
        </span>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <DeleteRequestModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setEventToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        eventName={eventToDelete?.name}
      />
    </div>
  )
} 