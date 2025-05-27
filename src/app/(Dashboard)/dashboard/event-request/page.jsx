'use client'
import React, { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { 
  Clock,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Star,
  Calendar,
  Mail,
  Phone,
  FileText,
  XIcon,
  Trash2,
} from 'lucide-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { dummyData } from '../_components/dummyData'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteRequestModal from '@/app/(Dashboard)/dashboard/_components/deleterequestmodal'
import ApproveRequestModal from '@/app/(Dashboard)/dashboard/_components/approverequestmodal'
import RejectRequestModal from '@/app/(Dashboard)/dashboard/_components/rejectrequestmodal'
import EventDetailsModal from '@/app/(Dashboard)/dashboard/_components/EventDetailsModal'
import EventRequestTable from '../_components/eventrequesttable'
import { subDays } from 'date-fns'

export default function EventRequest() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [timeFilter, setTimeFilter] = useState("30")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm">
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-sm">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500"
      case "cancelled":
        return "bg-red-500" 
      case "pending":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleDelete = (event) => {
    setEventToDelete(event)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    // Add your delete logic here
    console.log('Deleting event:', eventToDelete.id)
    setIsDeleteModalOpen(false)
    setEventToDelete(null)
  }

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const filteredEvents = useMemo(() => {
    // First filter by status
    let filtered = dummyData.filter((event) => {
      if (activeTab === "all") return true
      if (activeTab === "approved") return event.status === "completed"
      if (activeTab === "pending") return event.status === "pending"
      if (activeTab === "rejected") return event.status === "cancelled"
      return true
    })

    // Then filter by date range
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
      {/* Header Section */}
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

      {/* Filters and Table */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  All history
                </TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Rejected
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-40 shadow-sm">
                <Clock className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="15">Last 15 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <EventRequestTable 
            events={filteredEvents}
            onViewDetails={handleViewDetails}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Results Summary */}
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
