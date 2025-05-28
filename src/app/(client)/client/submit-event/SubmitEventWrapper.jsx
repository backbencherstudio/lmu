'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Loading component
const LoadingComponent = () => (
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

// Dynamically import the SubmitEvent component
const SubmitEventForm = dynamic(
  () => import('../_components/submitEvent'),
  {
    ssr: false,
    loading: () => <LoadingComponent />
  }
)

export default function SubmitEventWrapper() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SubmitEventForm />
    </Suspense>
  )
} 