'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from 'date-fns'
import { Calendar, Clock, Mail, Phone, FileText } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FaCheck, FaTimes } from 'react-icons/fa'
import ApproveRequestModal from './approverequestmodal'
import RejectRequestModal from './rejectrequestmodal'
import EventRequestApis from '@/app/API/EventreqApi'
import { toast } from 'react-hot-toast'

export default function EventDetailsModal({ event, isOpen, onClose, onStatusChange }) {
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!event) return null

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  const handleApprove = () => {
    setShowApproveModal(true)
  }

  const handleReject = () => {
    setShowRejectModal(true)
  }

  const handleApproveConfirm = async () => {
    try {
      setLoading(true)
      const response = await EventRequestApis.approveEventRequest(event.id)
      if (response.success) {
        toast.success('Event request approved successfully')
        setShowApproveModal(false)
        if (onStatusChange) onStatusChange()
        onClose()
      } else {
        toast.error(response.message || 'Failed to approve event request')
      }
    } catch (error) {
      console.error('Error approving event:', error)
      toast.error('Failed to approve event request')
    } finally {
      setLoading(false)
    }
  }

  const handleRejectConfirm = async () => {
    try {
      setLoading(true)
      const response = await EventRequestApis.rejectEventRequest(event.id)
      if (response.success) {
        toast.success('Event request rejected successfully')
        setShowRejectModal(false)
        if (onStatusChange) onStatusChange()
        onClose()
      } else {
        toast.error(response.message || 'Failed to reject event request')
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
      toast.error('Failed to reject event request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Event Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4 max-h-[80vh] overflow-y-auto">
          {/* Event Name */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              Request Date: {formatDate(event.submittedDate)}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">Email</span>
              </div>
              <p className="text-gray-700 break-all">{event.email}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center mb-2">
                <Phone className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium text-gray-900">Phone Number</span>
              </div>
              <p className="text-gray-700">{event.phone}</p>
            </div>
          </div>

          {/* Event Schedule */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium text-gray-900">Event Schedule</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Start Date</p>
                <p className="text-gray-900">{formatDate(event.startDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">End Date</p>
                <p className="text-gray-900">{formatDate(event.endDate)}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Start Time</p>
                  <p className="text-gray-900">{formatTime(event.startTime)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-600">End Time</p>
                  <p className="text-gray-900">{formatTime(event.endTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-medium text-gray-900">Event Description</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-end">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                  onClick={handleApprove}
                  disabled={loading || event.status === 'APPROVED'}
                >
                  <FaCheck className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                  onClick={handleReject}
                  disabled={loading || event.status === 'REJECTED'}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Approve Modal */}
      <ApproveRequestModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirm}
        eventName={event?.name}
        loading={loading}
      />

      {/* Reject Modal */}
      <RejectRequestModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        eventName={event?.name}
        loading={loading}
      />
    </Dialog>
  )
} 