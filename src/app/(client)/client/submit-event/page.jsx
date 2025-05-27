'use client'
import React from 'react';
import dynamic from 'next/dynamic';

const SubmitEvent = dynamic(
  () => import('../_components/submitEvent'),
  { ssr: false }
);

export default function SubmitEventPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <SubmitEvent />
    </div>
  );
} 