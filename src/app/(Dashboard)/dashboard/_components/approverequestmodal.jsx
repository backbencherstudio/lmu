'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from 'lucide-react'

export default function ApproveRequestModal({ isOpen, onClose, onConfirm, eventName, loading }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Confirm Approval</DialogTitle>
        </DialogHeader>
        
        <div className="p-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Approve Event Request</h4>
              <p className="text-sm text-gray-600">Are you sure you want to approve this event request?</p>
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
              disabled={loading}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 