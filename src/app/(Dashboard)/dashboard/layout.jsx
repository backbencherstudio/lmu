'use client'

import React from 'react'
import Leftbar from './_components/leftbar'

export default function Layout({ children }) {
  return (
    <div className="flex h-screen w-full">
      <div className="w-[15vw] h-full border-r border-gray-200">
        <Leftbar />
      </div>
      <div className="flex-1 h-full overflow-auto">
        {children}
      </div>
    </div>
  )
}
