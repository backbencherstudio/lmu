'use client'
import React, { useState, useEffect } from 'react'
import { 
  Eye,
  MoreHorizontal,
  Trash2,
  Clock
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventRequestApis from '@/app/API/EventreqApi'
import EventDetailsModal from './EventDetailsModal'

export default function EventRequestTable() {
  const [eventRequests, setEventRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeStatus, setActiveStatus] = useState('ALL')
  const [timeFilter, setTimeFilter] = useState('30')

  useEffect(() => {
    fetchEventRequests()
  }, [currentPage, activeStatus, timeFilter])

  const fetchEventRequests = async () => {
    try {
      setLoading(true)
      const response = await EventRequestApis.getAllEventRequests({
        page: currentPage,
        limit: 10,
        status: activeStatus === 'ALL' ? undefined : activeStatus,
        days: parseInt(timeFilter)
      })
      
      if (response.success) {
        setEventRequests(response.data)
        setTotalPages(response.totalPages)
      }
    } catch (error) {
      console.error('Error fetching event requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (event) => {
    try {
      const response = await EventRequestApis.deleteEventRequest(event.id)
      if (response.success) {
        fetchEventRequests() // Refresh the list after deletion
      }
    } catch (error) {
      console.error('Error deleting event request:', error)
    }
  }

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-sm">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-sm">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear(),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="APPROVED">Approved</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <Clock className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="15">Last 15 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 bg-gray-50/50">
              <TableHead className="font-semibold text-gray-900 w-[120px]">Date</TableHead>
              <TableHead className="font-semibold text-gray-900 w-[40%]">Event Details</TableHead>
              <TableHead className="font-semibold text-gray-900 w-[15%]">Phone Number</TableHead>
              <TableHead className="font-semibold text-gray-900 w-[100px]">Status</TableHead>
              <TableHead className="font-semibold text-gray-900 w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventRequests.map((event) => {
              const dateInfo = formatDate(event.createdAt || new Date())
              return (
                <TableRow
                  key={event.id}
                  className="border-gray-50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200 group cursor-pointer"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                          <span className="text-sm font-bold text-gray-900">{dateInfo.day}</span>
                          <span className="text-xs text-gray-600">{dateInfo.month}</span>
                        </div>
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                            event.status.toLowerCase() === "approved"
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                              : event.status.toLowerCase() === "rejected"
                              ? "bg-gradient-to-r from-red-500 to-red-600"
                              : "bg-gradient-to-r from-amber-500 to-orange-500"
                          }`}
                        />
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-xs text-gray-500">{dateInfo.weekday}</div>
                        <div className="text-xs text-gray-400">{dateInfo.year}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 max-w-md">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                            {event.name?.substring(0, 2).toUpperCase() || 'NA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {event.name || 'Unnamed Event'}
                          </div>
                          <div className="text-xs text-gray-500">{event.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2 max-w-md">{event.description}</div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="text-sm text-gray-600">{event.phone || 'N/A'}</div>
                  </TableCell>

                  <TableCell className="py-4">{getStatusBadge(event.status)}</TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-500 hover:text-white bg-gray-50 shadow-sm font-semibold"
                        onClick={() => handleViewDetails(event)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-100"
                            onClick={() => handleDelete(event)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {eventRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No event requests found
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      )}

      <EventDetailsModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
        }}
      />
    </div>
  )
} 