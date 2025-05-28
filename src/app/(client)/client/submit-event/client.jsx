'use client'
import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

const SubmitEvent = dynamic(
  () => import('../_components/submitEvent'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
)

export default function SubmitEventClient() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <SubmitEvent />
    </Suspense>
  )
} 