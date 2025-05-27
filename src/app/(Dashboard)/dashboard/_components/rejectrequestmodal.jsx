'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XCircle } from 'lucide-react'

export default function RejectRequestModal({ isOpen, onClose, onConfirm, eventName }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Confirm Rejection</DialogTitle>
        </DialogHeader>
        
        <div className="p-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Reject Event Request</h4>
              <p className="text-sm text-gray-600">Are you sure you want to reject this event request?</p>
            </div>
          </div>

          {eventName && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">Event Name:</p>
              <p className="text-base font-medium text-gray-900">{eventName}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 