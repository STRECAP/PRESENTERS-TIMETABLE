'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Timetable from './components/Timetable'
import PresenterManagement from './components/PresenterManagement'
import Settings from './components/Settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Presenter } from './types'
import { PRESENTERS } from './data/presenters'

const { jsx, jsxs } = React

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [presenters, setPresenters] = useState<Presenter[]>(() => {
    if (typeof window !== 'undefined') {
      const savedPresenters = localStorage.getItem('presenters')
      return savedPresenters ? JSON.parse(savedPresenters) : PRESENTERS
    }
    return PRESENTERS
  })

  useEffect(() => {
    localStorage.setItem('presenters', JSON.stringify(presenters))
  }, [presenters])

  const handlePresentersChange = (updatedPresenters: Presenter[]) => {
    setPresenters(updatedPresenters)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-[1800px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Presenters Timetable</h1>
        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="presenters">Manage Presenters</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="timetable">
            <Timetable soundEnabled={soundEnabled} presenters={presenters} />
          </TabsContent>
          <TabsContent value="presenters">
            <PresenterManagement soundEnabled={soundEnabled} onPresentersChange={handlePresentersChange} />
          </TabsContent>
          <TabsContent value="settings">
            <Settings soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

